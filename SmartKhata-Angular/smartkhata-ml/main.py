from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
model = joblib.load("smartkhata_model.pkl")

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "smartkhata",
    "user": "postgres",
    "password": "postgres"
}

def get_conn():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

class PredictRequest(BaseModel):
    product: str

@app.get("/predict/all")
def predict_all():
    """Predict restock needs for all products using live DB data."""
    conn = get_conn()
    cur = conn.cursor()

    # Get stock info
    cur.execute("SELECT name, category, unit, quantity, purchase_price, selling_price FROM stock_items")
    stock_rows = cur.fetchall()

    results = []

    for stock in stock_rows:
        product = stock["name"]

        # Get last 30 days sales for this product
        cur.execute("""
            SELECT 
                EXTRACT(DOW FROM date) AS day_of_week,
                EXTRACT(WEEK FROM date) AS week_of_year,
                EXTRACT(MONTH FROM date) AS month,
                quantity, selling_price, total
            FROM sale_entries
            WHERE product = %s
              AND date >= NOW() - INTERVAL '30 days'
            ORDER BY date DESC
            LIMIT 30
        """, (product,))
        sales = cur.fetchall()

        if not sales:
            avg_qty = 0
            avg_price = float(stock["selling_price"])
            day_of_week = datetime.now().weekday()
            week_of_year = datetime.now().isocalendar()[1]
            month = datetime.now().month
        else:
            avg_qty   = sum(float(r["quantity"]) for r in sales) / len(sales)
            avg_price = sum(float(r["selling_price"]) for r in sales) / len(sales)
            day_of_week  = float(sales[0]["day_of_week"])
            week_of_year = float(sales[0]["week_of_year"])
            month        = float(sales[0]["month"])

        # Build feature row matching your training columns
        features = pd.DataFrame([{
            "day_of_week":   day_of_week,
            "week_of_year":  week_of_year,
            "month":         month,
            "quantity":      avg_qty,
            "purchase_price": float(stock["purchase_price"]),
            "selling_price": avg_price,
        }])

        try:
            predicted_qty = float(model.predict(features)[0])
        except Exception as e:
            predicted_qty = avg_qty * 7  # fallback: 1-week supply

        current_qty = float(stock["quantity"])
        restock_needed = max(0, round(predicted_qty - current_qty, 2))
        days_left = round(current_qty / avg_qty, 1) if avg_qty > 0 else 99

        results.append({
            "product":        product,
            "category":       stock["category"],
            "unit":           stock["unit"],
            "currentStock":   current_qty,
            "predictedNeed":  round(predicted_qty, 2),
            "restockAmount":  restock_needed,
            "daysLeft":       days_left,
            "urgency":        "critical" if days_left <= 3
                              else "warning" if days_left <= 7
                              else "ok"
        })

    cur.close()
    conn.close()

    results.sort(key=lambda x: x["daysLeft"])
    return results


@app.get("/predict/product/{product_name}")
def predict_product(product_name: str):
    """Predict for a single product."""
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        "SELECT name, category, unit, quantity, purchase_price, selling_price FROM stock_items WHERE name = %s",
        (product_name,)
    )
    stock = cur.fetchone()
    if not stock:
        return {"error": "Product not found"}

    cur.execute("""
        SELECT quantity, selling_price
        FROM sale_entries
        WHERE product = %s AND date >= NOW() - INTERVAL '30 days'
    """, (product_name,))
    sales = cur.fetchall()

    avg_qty   = sum(float(r["quantity"]) for r in sales) / len(sales) if sales else 0
    avg_price = float(stock["selling_price"])
    now = datetime.now()

    features = pd.DataFrame([{
        "day_of_week":    now.weekday(),
        "week_of_year":   now.isocalendar()[1],
        "month":          now.month,
        "quantity":       avg_qty,
        "purchase_price": float(stock["purchase_price"]),
        "selling_price":  avg_price,
    }])

    predicted_qty = float(model.predict(features)[0])
    current_qty   = float(stock["quantity"])
    restock_needed = max(0, round(predicted_qty - current_qty, 2))
    days_left = round(current_qty / avg_qty, 1) if avg_qty > 0 else 99

    cur.close()
    conn.close()

    return {
        "product":       product_name,
        "currentStock":  current_qty,
        "predictedNeed": round(predicted_qty, 2),
        "restockAmount": restock_needed,
        "daysLeft":      days_left,
        "urgency":       "critical" if days_left <= 3 else "warning" if days_left <= 7 else "ok"
    }

