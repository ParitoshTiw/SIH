"""SQLite persistence for the KrishiSetu demo.

The schema is deliberately compact so it can be replaced by PostgreSQL without
changing the HTTP API later in the project.
"""
from __future__ import annotations

import sqlite3
from datetime import date, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "krishi_setu.db"


PRODUCTS = [
    ("Aarav Patel", "AP", "Nashik, Maharashtra", "Farm-fresh Tomatoes", "ताज़े टमाटर", "Vegetables", 42, "kg", 32, 48, "2026-08-28", "Naturally ripened, graded on the farm and packed after order confirmation.", "https://images.unsplash.com/photo-1546470427-227c8b6fcd84?auto=format&fit=crop&w=900&q=85", 1, 1, 260),
    ("Meera Devi", "MD", "Kolar, Karnataka", "Crisp Green Capsicum", "हरी शिमला मिर्च", "Vegetables", 18, "kg", 54, 74, "2026-08-29", "Pesticide-responsible capsicum from a women-led producer group.", "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=85", 1, 0, 95),
    ("Sanjay FPO", "SF", "Sehore, Madhya Pradesh", "Sharbati Wheat", "शरबती गेहूं", "Grains", 60, "kg", 36, 49, "2026-08-21", "Stone-mill friendly premium wheat, cleaned and traceable to the FPO lot.", "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=85", 1, 1, 740),
    ("Ritu Sharma", "RS", "Pune, Maharashtra", "Purple Brinjal", "बैंगनी बैंगन", "Vegetables", 16, "kg", 38, 58, "2026-08-29", "Harvested this morning. Ideal for bharta and roasting.", "https://images.unsplash.com/photo-1594282486552-05ccc31a4b0b?auto=format&fit=crop&w=900&q=85", 1, 0, 86),
    ("Ramesh Gowda", "RG", "Chikkaballapur, Karnataka", "Sweet Bananas", "मीठे केले", "Fruits", 12, "dozen", 52, 73, "2026-08-27", "Naturally ripened, carefully cushioned for door-step delivery.", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85", 1, 1, 130),
    ("Sundar Organics", "SO", "Mysuru, Karnataka", "Desi Toor Dal", "देसी तूर दाल", "Pulses", 1, "kg", 140, 178, "2026-08-12", "Unpolished toor dal from a certified organic collective.", "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=85", 1, 1, 310),
]


def connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialise() -> None:
    with connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_name TEXT NOT NULL,
                farmer_initials TEXT NOT NULL,
                farm_location TEXT NOT NULL,
                title TEXT NOT NULL,
                hindi_title TEXT,
                category TEXT NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL,
                price REAL NOT NULL,
                market_price REAL NOT NULL,
                harvest_date TEXT NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT,
                image_data TEXT,
                is_verified INTEGER NOT NULL DEFAULT 0,
                is_organic INTEGER NOT NULL DEFAULT 0,
                inventory REAL NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS price_points (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                crop TEXT NOT NULL,
                record_date TEXT NOT NULL,
                farm_price REAL NOT NULL,
                retail_price REAL NOT NULL,
                mandi_price REAL NOT NULL,
                source TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS logistics_hubs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                city TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                capacity INTEGER NOT NULL,
                active_orders INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_code TEXT NOT NULL UNIQUE,
                customer_name TEXT NOT NULL,
                customer_phone TEXT,
                address TEXT NOT NULL,
                items_json TEXT NOT NULL,
                total REAL NOT NULL,
                payment_method TEXT NOT NULL,
                payment_status TEXT NOT NULL,
                fulfilment_status TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        if conn.execute("SELECT COUNT(*) FROM products").fetchone()[0] == 0:
            conn.executemany(
                """
                INSERT INTO products (
                    farmer_name, farmer_initials, farm_location, title, hindi_title,
                    category, quantity, unit, price, market_price, harvest_date,
                    description, image_url, is_verified, is_organic, inventory
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                PRODUCTS,
            )
        if conn.execute("SELECT COUNT(*) FROM price_points").fetchone()[0] == 0:
            _seed_price_points(conn)
        if conn.execute("SELECT COUNT(*) FROM logistics_hubs").fetchone()[0] == 0:
            conn.executemany(
                "INSERT INTO logistics_hubs (name, city, latitude, longitude, capacity, active_orders) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    ("Nashik Harvest Hub", "Nashik", 19.9975, 73.7898, 240, 138),
                    ("Pune Fresh Centre", "Pune", 18.5204, 73.8567, 330, 204),
                    ("Bengaluru South Hub", "Bengaluru", 12.9716, 77.5946, 420, 278),
                ],
            )


def _seed_price_points(conn: sqlite3.Connection) -> None:
    # Demonstration historical points; the live provider replaces them when an
    # UPAg Open API feed is configured.
    baseline = {
        "Tomato": (32, 48, [36, 34, 30, 31, 35, 32, 32]),
        "Capsicum": (54, 74, [65, 61, 59, 58, 56, 55, 54]),
        "Wheat": (36, 49, [35, 36, 37, 36, 35, 36, 36]),
        "Banana": (52, 73, [47, 48, 51, 53, 50, 52, 52]),
        "Toor Dal": (140, 178, [150, 147, 143, 142, 141, 139, 140]),
    }
    today = date.today()
    rows = []
    for crop, (farm, retail, values) in baseline.items():
        for index, mandi in enumerate(values):
            adjustment = mandi - values[-1]
            rows.append((crop, (today - timedelta(days=(6 - index) * 5)).isoformat(), max(1, farm + adjustment * 0.55), max(1, retail + adjustment * 0.9), mandi, "UPAg-compatible market feed"))
    conn.executemany(
        "INSERT INTO price_points (crop, record_date, farm_price, retail_price, mandi_price, source) VALUES (?, ?, ?, ?, ?, ?)",
        rows,
    )


def rows_as_dicts(rows):
    return [dict(row) for row in rows]


def list_products(query: str = "", category: str = ""):
    statement = "SELECT * FROM products WHERE inventory > 0"
    params = []
    if query:
        statement += " AND (title LIKE ? OR farmer_name LIKE ? OR farm_location LIKE ? OR category LIKE ?)"
        needle = f"%{query}%"
        params.extend([needle, needle, needle, needle])
    if category and category != "All":
        statement += " AND category = ?"
        params.append(category)
    statement += " ORDER BY is_verified DESC, created_at DESC"
    with connection() as conn:
        return rows_as_dicts(conn.execute(statement, params).fetchall())


def get_product(product_id: int):
    with connection() as conn:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return dict(row) if row else None


def add_product(payload: dict) -> dict:
    required = ["farmer_name", "farm_location", "title", "category", "quantity", "unit", "price", "market_price", "harvest_date", "description"]
    missing = [key for key in required if not str(payload.get(key, "")).strip()]
    if missing:
        raise ValueError(f"Missing required listing fields: {', '.join(missing)}")
    initials = "".join(word[:1] for word in payload["farmer_name"].split()[:2]).upper() or "FP"
    values = (
        payload["farmer_name"].strip(), initials, payload["farm_location"].strip(), payload["title"].strip(),
        payload.get("hindi_title", "").strip(), payload["category"].strip(), float(payload["quantity"]),
        payload["unit"].strip(), float(payload["price"]), float(payload["market_price"]),
        payload["harvest_date"], payload["description"].strip(), payload.get("image_url", ""),
        payload.get("image_data", ""), int(bool(payload.get("is_organic"))), float(payload.get("inventory", payload["quantity"])),
    )
    with connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO products (farmer_name, farmer_initials, farm_location, title, hindi_title, category,
                quantity, unit, price, market_price, harvest_date, description, image_url, image_data,
                is_verified, is_organic, inventory)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
            """,
            values,
        )
    return get_product(cursor.lastrowid)


def price_trends(crop: str):
    with connection() as conn:
        rows = conn.execute("SELECT crop, record_date, farm_price, retail_price, mandi_price, source FROM price_points WHERE crop = ? ORDER BY record_date", (crop,)).fetchall()
        crops = [row[0] for row in conn.execute("SELECT DISTINCT crop FROM price_points ORDER BY crop").fetchall()]
    return rows_as_dicts(rows), crops


def hubs():
    with connection() as conn:
        return rows_as_dicts(conn.execute("SELECT * FROM logistics_hubs ORDER BY active_orders DESC").fetchall())


def create_order(payload: dict) -> dict:
    import json
    import secrets

    items = payload.get("items") or []
    if not items or not payload.get("customer_name") or not payload.get("address"):
        raise ValueError("Customer name, delivery address, and at least one item are required.")
    total = sum(float(item.get("price", 0)) * float(item.get("quantity", 0)) for item in items)
    code = f"KS-{date.today().strftime('%y%m%d')}-{secrets.token_hex(3).upper()}"
    payment_method = payload.get("payment_method", "UPI")
    status = "pay_on_delivery" if payment_method == "COD" else "payment_initiated"
    with connection() as conn:
        cursor = conn.execute(
            """INSERT INTO orders (order_code, customer_name, customer_phone, address, items_json, total,
                payment_method, payment_status, fulfilment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (code, payload["customer_name"], payload.get("customer_phone", ""), payload["address"], json.dumps(items), total, payment_method, status, "cluster_queued"),
        )
        row = conn.execute("SELECT * FROM orders WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return dict(row)
