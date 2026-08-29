"""KrishiSetu zero-dependency marketplace server. Run: python app.py"""
from __future__ import annotations

import json
import math
import mimetypes
import os
import urllib.error
from http import HTTPStatus
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen

import database
import upag_service


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
MAX_BODY_BYTES = 8 * 1024 * 1024


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    latitude_1, longitude_1 = map(math.radians, a)
    latitude_2, longitude_2 = map(math.radians, b)
    value = math.sin((latitude_2 - latitude_1) / 2) ** 2 + math.cos(latitude_1) * math.cos(latitude_2) * math.sin((longitude_2 - longitude_1) / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(value))


def nearest_route(stops: list[dict]) -> list[dict]:
    route = [stops[0]]
    remaining = stops[1:]
    while remaining:
        current = route[-1]
        closest = min(remaining, key=lambda place: haversine_km((current["lat"], current["lng"]), (place["lat"], place["lng"])))
        route.append(closest)
        remaining.remove(closest)
    return route


def optimise_osm_route(stops: list[dict]) -> dict:
    """Use OSRM's OSM-based Trip service; fall back to a deterministic local plan."""
    normalised = [{"name": str(item.get("name", "Stop")), "lat": float(item["lat"]), "lng": float(item["lng"])} for item in stops]
    if len(normalised) < 2:
        raise ValueError("Add a collection point and at least one delivery stop.")
    if len(normalised) > 10:
        raise ValueError("Optimise up to 10 stops at a time.")
    coordinates = ";".join(f"{item['lng']},{item['lat']}" for item in normalised)
    endpoint = f"https://router.project-osrm.org/trip/v1/driving/{coordinates}?source=first&roundtrip=false&overview=full&geometries=geojson&steps=false"
    try:
        request = Request(endpoint, headers={"Accept": "application/json", "User-Agent": "KrishiSetu-SIH/1.0 (student prototype)"})
        with urlopen(request, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
        trip = data["trips"][0]
        # OSRM returns waypoints in the *submitted* order, while each
        # `waypoint_index` is its position in the optimised trip. Invert that
        # mapping so the UI's numbered stops follow the actual driving order.
        ordered_stops = [None] * len(normalised)
        for submitted_index, waypoint in enumerate(data["waypoints"]):
            ordered_stops[waypoint["waypoint_index"]] = normalised[submitted_index]
        return {"provider": "OSRM / OpenStreetMap", "mode": "live", "ordered_stops": ordered_stops, "distance_km": round(trip["distance"] / 1000, 1), "duration_min": round(trip["duration"] / 60), "geometry": trip["geometry"]}
    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, ValueError, TimeoutError) as error:
        ordered_stops = nearest_route(normalised)
        distance = sum(haversine_km((first["lat"], first["lng"]), (second["lat"], second["lng"])) for first, second in zip(ordered_stops, ordered_stops[1:]))
        return {"provider": "Local distance fallback", "mode": "fallback", "note": f"OSM route service temporarily unavailable: {error}", "ordered_stops": ordered_stops, "distance_km": round(distance, 1), "duration_min": round(distance / 28 * 60), "geometry": {"type": "LineString", "coordinates": [[item["lng"], item["lat"]] for item in ordered_stops]}}


class KrishiSetuHandler(BaseHTTPRequestHandler):
    server_version = "KrishiSetu/1.0"

    def log_message(self, format, *args):
        print(f"[KrishiSetu] {self.address_string()} - {format % args}")

    def _json(self, data, status=HTTPStatus.OK):
        body = json.dumps(data, ensure_ascii=False, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0))
        if length > MAX_BODY_BYTES:
            raise ValueError("Request is too large. Crop photos must be below 5 MB.")
        payload = self.rfile.read(length).decode("utf-8")
        return json.loads(payload or "{}")

    def _error(self, message, status=HTTPStatus.BAD_REQUEST):
        self._json({"error": message}, status)

    def do_GET(self):
        parsed = urlparse(self.path)
        query = {key: values[0] for key, values in parse_qs(parsed.query).items()}
        path = parsed.path
        try:
            if path == "/api/health":
                self._json({"status": "ok", "service": "KrishiSetu", "database": str(database.DB_PATH.name)})
            elif path == "/api/products":
                self._json({"products": database.list_products(query.get("q", ""), query.get("category", ""))})
            elif path.startswith("/api/products/"):
                product = database.get_product(int(path.rsplit("/", 1)[1]))
                self._json({"product": product} if product else {"error": "Product not found"}, HTTPStatus.OK if product else HTTPStatus.NOT_FOUND)
            elif path == "/api/price-trends":
                crop = query.get("crop", "Tomato")
                points, crops = database.price_trends(crop)
                self._json({"crop": crop, "points": points, "crops": crops})
            elif path == "/api/upag/market-data":
                self._json(upag_service.market_data(query.get("crop", "Tomato")))
            elif path == "/api/upag/status":
                self._json(upag_service.status())
            elif path == "/api/logistics/hubs":
                self._json({"hubs": database.hubs()})
            else:
                self._serve_static(path)
        except (ValueError, KeyError) as error:
            self._error(str(error))
        except Exception as error:
            self._error(f"Unexpected server error: {error}", HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_POST(self):
        parsed = urlparse(self.path)
        try:
            payload = self._read_json()
            if parsed.path == "/api/products":
                self._json({"product": database.add_product(payload), "message": "Your crop listing is live for review."}, HTTPStatus.CREATED)
            elif parsed.path == "/api/orders":
                order = database.create_order(payload)
                # A gateway adapter belongs here. Never mark a payment settled
                # until its signed webhook has been verified server-side.
                self._json({"order": order, "payment": {"provider": "Gateway adapter pending", "status": order["payment_status"], "message": "Select a live gateway (e.g. Razorpay) and add its secure server credentials to activate collection."}}, HTTPStatus.CREATED)
            elif parsed.path == "/api/routes/optimise":
                self._json(optimise_osm_route(payload.get("stops", [])))
            elif parsed.path == "/api/fulfilment/plan":
                stops = payload.get("stops", [])
                route = optimise_osm_route(stops)
                units = int(payload.get("units", 0))
                route["fulfilment"] = {
                    "strategy": "micro-cluster consolidation",
                    "suggested_vehicle": "EV cargo three-wheeler" if units <= 180 else "refrigerated mini-truck",
                    "orders_consolidated": max(1, round(units / 5)),
                    "estimated_empty_km_saved": round(route["distance_km"] * 0.28, 1),
                    "cold_chain_required": bool(payload.get("cold_chain", True)),
                }
                self._json(route)
            else:
                self._error("API route not found", HTTPStatus.NOT_FOUND)
        except json.JSONDecodeError:
            self._error("Send a valid JSON request body.")
        except ValueError as error:
            self._error(str(error))
        except Exception as error:
            self._error(f"Unexpected server error: {error}", HTTPStatus.INTERNAL_SERVER_ERROR)

    def _serve_static(self, request_path: str):
        requested = "index.html" if request_path in {"/", ""} else request_path.lstrip("/")
        candidate = (STATIC_DIR / requested).resolve()
        try:
            candidate.relative_to(STATIC_DIR.resolve())
        except ValueError:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if not candidate.exists() or not candidate.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        body = candidate.read_bytes()
        mime_type = mimetypes.guess_type(str(candidate))[0] or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", f"{mime_type}; charset=utf-8" if mime_type.startswith("text/") or mime_type in {"application/javascript", "application/json"} else mime_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    database.initialise()
    port = int(os.getenv("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), KrishiSetuHandler)
    print(f"KrishiSetu is ready at http://127.0.0.1:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nKrishiSetu stopped.")
    finally:
        server.server_close()
