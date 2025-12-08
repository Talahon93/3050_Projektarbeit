from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------
# Daten laden
# ---------------------------------------------------------

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Gesamtdatensatz.csv"

df = pd.read_csv(DATA_PATH)

# timestamp in Datetime umwandeln und Zeitzone entfernen
ts = pd.to_datetime(df["timestamp"])
try:
    # falls Werte tz-aware sind (z.B. +00:00), Zeitzone entfernen
    ts = ts.dt.tz_convert(None)
except TypeError:
    # falls schon tz-naiv, einfach so lassen
    pass

df["timestamp"] = ts

# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Passanten & Wetter API (RAW + Filter)",
    description="Rohdaten je Zeit & Eingang mit optionalem Zeitfilter",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Test-Endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Backend läuft",
        "info": "Benutze /daten oder /wetter-uebersicht mit ?start=YYYY-MM-DD&end=YYYY-MM-DD",
    }

# ---------------------------------------------------------
# Rohdaten mit Zeitfilter (falls du sie noch brauchst)
# ---------------------------------------------------------

@app.get("/daten")
def daten(start=None, end=None):
    data = df.copy()

    if start is not None:
        start_dt = pd.to_datetime(start)
        data = data[data["timestamp"] >= start_dt]

    if end is not None:
        end_dt = pd.to_datetime(end)
        data = data[data["timestamp"] <= end_dt]

    ergebnis = []
    for _, row in data.iterrows():
        ergebnis.append(
            {
                "timestamp": row["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                "location_name": row["location_name"],
                "weather_condition": row["weather_condition"],
                "pedestrians_count": int(row["pedestrians_count"]),
            }
        )

    return {"results": ergebnis}

# ---------------------------------------------------------
# Aggregation: Wetterübersicht
# ---------------------------------------------------------

@app.get("/wetter-uebersicht")
def wetter_uebersicht(start=None, end=None, location_name=None):
    """
    Aggregiert die Daten nach Wetterkondition.
    Optional filterbar nach:
      - start (YYYY-MM-DD)
      - end (YYYY-MM-DD)
      - location_name (genauer Name des Eingangs)
    """

    data = df.copy()

    if start is not None:
        start_dt = pd.to_datetime(start)
        data = data[data["timestamp"] >= start_dt]

    if end is not None:
        end_dt = pd.to_datetime(end)
        data = data[data["timestamp"] <= end_dt]

    if location_name is not None:
        data = data[data["location_name"] == location_name]

    if data.empty:
        return {"results": []}

    grouped = (
        data.groupby("weather_condition")["pedestrians_count"]
        .mean()
        .reset_index()
    )

    grouped["pedestrians_count"] = grouped["pedestrians_count"].round(2)

    results = []
    for _, row in grouped.iterrows():
        results.append(
            {
                "weather_condition": row["weather_condition"],
                "mean_pedestrians": float(row["pedestrians_count"]),
            }
        )

    return {"results": results}
