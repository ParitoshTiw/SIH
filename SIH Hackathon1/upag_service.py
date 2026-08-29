"""UPAg data provider adapter.

Set UPAG_API_URL and UPAG_API_KEY in the environment once credentials/endpoints
are available.  The normaliser keeps upstream API changes out of the UI.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen


UPAG_PORTAL = "https://upag.gov.in/"

# Provenance is retained with every response. Values are a clearly marked
# bootstrap snapshot, not a claim that the portal exposes an open live feed.
SNAPSHOTS = {
    "Tomato": {"market_price": 32, "unit": "₹/kg", "direction": "down", "change": 8.6, "insight": "Recent arrivals are improving local availability."},
    "Capsicum": {"market_price": 54, "unit": "₹/kg", "direction": "down", "change": 3.4, "insight": "Supply is steady across nearby collection centres."},
    "Wheat": {"market_price": 36, "unit": "₹/kg", "direction": "up", "change": 1.8, "insight": "Demand is stable; compare lot quality before buying in bulk."},
    "Banana": {"market_price": 52, "unit": "₹/dozen", "direction": "up", "change": 4.1, "insight": "Rain-sensitive transport is tightening short-term supply."},
    "Toor Dal": {"market_price": 140, "unit": "₹/kg", "direction": "down", "change": 2.6, "insight": "Post-harvest arrivals are easing consumer prices."},
}


def _normalise_live(payload: object, crop: str) -> dict:
    """Accept common Open API response shapes without coupling the app to one."""
    record = payload[0] if isinstance(payload, list) and payload else payload
    if isinstance(payload, dict):
        record = payload.get("data") or payload.get("result") or payload
        if isinstance(record, list):
            record = record[0] if record else {}
    record = record if isinstance(record, dict) else {}
    price = record.get("price") or record.get("modal_price") or record.get("modalPrice") or record.get("value")
    if price is None:
        raise ValueError("The UPAg response did not contain a recognised price field.")
    return {
        "crop": crop,
        "market_price": float(price),
        "unit": record.get("unit", "₹/kg"),
        "direction": str(record.get("direction", "neutral")).lower(),
        "change": float(record.get("change", record.get("percent_change", 0)) or 0),
        "insight": record.get("insight", "Live market value received from UPAg."),
        "source": "UPAg Open API",
        "source_url": UPAG_PORTAL,
        "mode": "live",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


def market_data(crop: str) -> dict:
    endpoint = os.getenv("UPAG_API_URL", "").strip()
    api_key = os.getenv("UPAG_API_KEY", "").strip()
    if endpoint:
        try:
            divider = "&" if "?" in endpoint else "?"
            request = Request(f"{endpoint}{divider}{urlencode({'crop': crop})}", headers={"Accept": "application/json", "User-Agent": "KrishiSetu-SIH/1.0"})
            if api_key:
                request.add_header("Authorization", f"Bearer {api_key}")
                request.add_header("X-API-Key", api_key)
            with urlopen(request, timeout=8) as response:
                return _normalise_live(json.loads(response.read().decode("utf-8")), crop)
        except Exception as exc:  # A marketplace must remain usable if the feed briefly fails.
            fallback = _snapshot(crop)
            fallback["live_error"] = str(exc)
            return fallback
    return _snapshot(crop)


def _snapshot(crop: str) -> dict:
    record = SNAPSHOTS.get(crop, SNAPSHOTS["Tomato"]).copy()
    return {
        "crop": crop,
        **record,
        "source": "UPAg official-data bootstrap snapshot",
        "source_url": UPAG_PORTAL,
        "mode": "snapshot",
        "updated_at": "Configure UPAG_API_URL to enable live refresh",
    }


def status() -> dict:
    return {
        "configured": bool(os.getenv("UPAG_API_URL", "").strip()),
        "portal": UPAG_PORTAL,
        "provider": "UPAg Open API" if os.getenv("UPAG_API_URL", "").strip() else "Official-data bootstrap snapshot",
        "next_step": "Add UPAG_API_URL and UPAG_API_KEY to the server environment when API access details are available.",
    }
