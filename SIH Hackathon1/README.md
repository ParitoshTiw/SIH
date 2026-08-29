# KrishiSetu — SIH 26033 prototype

KrishiSetu is a full-stack prototype for SIH problem statement 26033: reducing intermediary layers between farmers/FPOs and consumers or bulk buyers. It is intentionally dependency-free so a hackathon team can run and demo it on a new machine with Python installed.

## What is included

- Direct farm marketplace with search, category filters, farmer verification, farmer/FPO listings, and crop-photo upload.
- SQLite database for products, historical price points, logistics hubs, and orders (`data/krishi_setu.db`, automatically created).
- English, Hindi, and Marathi UI switching; the translation dictionary is easy to extend in `static/app.js`.
- UPAg provider adapter with honest source attribution. It supports a bootstrap official-data snapshot while you await API access, then switches to a live UPAg feed with environment configuration.
- Price-trend chart comparing direct farmer price and typical retail price, including buyer savings.
- OpenStreetMap tiles via Leaflet and OSM-based OSRM Trip API for multi-stop delivery optimisation. If that public routing service is unavailable, the server produces a transparent local-distance fallback.
- Payment-mode checkout (UPI, card, and cash-on-delivery) plus safe server-side order creation. It deliberately does **not** claim to take real money until a payment gateway is configured.
- Fulfilment API that proposes clustered deliveries, an appropriate vehicle, and estimated empty-kilometre savings.

## Run it

This project uses only the Python standard library (Python 3.10+).

```powershell
cd "C:\Users\hp\Documents\Codex\2026-08-29\i-am-participating-in-sih-hackathon\outputs\krishi-setu"
python app.py
```

On Windows, `py app.py` is equivalent if you use the Python launcher. Then visit [http://127.0.0.1:8000](http://127.0.0.1:8000). Use `Ctrl+C` in the terminal to stop it.

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/products?category=&q=` | Browse marketplace listings |
| `POST` | `/api/products` | Create a crop listing (accepts base64 `image_data`) |
| `GET` | `/api/price-trends?crop=Tomato` | Direct vs retail price series |
| `GET` | `/api/upag/market-data?crop=Tomato` | UPAg adapter response and provenance |
| `GET` | `/api/upag/status` | Confirms whether official live access is configured |
| `GET` | `/api/logistics/hubs` | Collection / consolidation hubs |
| `POST` | `/api/routes/optimise` | OSM-based multi-stop route optimisation |
| `POST` | `/api/fulfilment/plan` | Route plus cluster/vehicle efficiency plan |
| `POST` | `/api/orders` | Creates an order and payment hand-off state |

Example route request:

```json
{
  "stops": [
    {"name":"Nashik Harvest Hub","lat":19.9975,"lng":73.7898},
    {"name":"Pune Fresh Centre","lat":18.5204,"lng":73.8567},
    {"name":"Neighbourhood drops","lat":18.5624,"lng":73.9167}
  ],
  "units": 190,
  "cold_chain": true
}
```

## Connect the real UPAg feed

The UPAg portal identifies itself as the Department of Agriculture & Farmers Welfare's central data platform, with market intelligence including price, arrivals, production, trade and procurement. Its portal advertises an Open API connection but does not document a public anonymous market endpoint. Until you provide your approved API URL/key, the app labels its local values as an **official-data bootstrap snapshot** and provides the [UPAg portal source](https://upag.gov.in/).

When you receive the integration details, set these server-side (never in browser JavaScript):

```powershell
$env:UPAG_API_URL = "https://<approved-upag-endpoint>"
$env:UPAG_API_KEY = "<secret>"
python app.py
```

The normaliser in `upag_service.py` accepts a common response shape such as `data[0].modal_price`, `price`, or `value`. Send the API details and this can be tightened to UPAg's exact schema, filters, auth headers, rate limits, and refresh cadence.

## Before production / final SIH demo

1. Replace the Unsplash demo images and bootstrap market data with approved UPAg records, retaining source and update timestamps.
2. Add authentication plus role-based dashboards for consumer, farmer, FPO, driver, and admin.
3. Connect a payment provider such as Razorpay **on the server**, create orders there, and verify signed webhooks before marking any payment paid.
4. Use a paid/self-hosted routing service or comply with the public OSRM and OpenStreetMap tile usage policies at scale.
5. Move SQLite to PostgreSQL; store crop photos in object storage and store only image URLs in the database.

## Technical choices for judges

- A direct list-to-buy workflow exposes the price gap and shows explicit consumer savings.
- Demand and fulfilment signals can consolidate nearby drop-offs, avoid empty kilometres, choose vehicles, and flag cold-chain needs.
- The UPAg adapter makes national market intelligence usable beside local supply instead of treating it as a disconnected dashboard.
- API boundaries are intentionally isolated: database, UPAg, payments, routing, and UI can each evolve independently as partner APIs become available.
