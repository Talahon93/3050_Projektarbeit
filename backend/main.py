from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------
# Daten laden
# ---------------------------------------------------------

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Gesamtdatensatz.csv"

# CSV einlesen (nicht read_json!)
df = pd.read_csv(DATA_PATH)

# timestamp in echtes Datetime-Objekt umwandeln (Zeitzone wird automatisch entfernt)
df["timestamp"] = pd.to_datetime(df["timestamp"])

# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Passanten & Wetter API (RAW + Filter)",
    description="Rohdaten je Zeit & Eingang mit optionalem Zeitfilter",
)

# CORS erlauben für dein Frontend
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
        "info": "Benutze /daten mit ?start=YYYY-MM-DD&end=YYYY-MM-DD",
    }


# ---------------------------------------------------------
# Haupt-Endpoint: ROHDATEN mit Zeitfilter
# ---------------------------------------------------------

@app.get("/daten")
def daten(start=None, end=None):
    """
    Gibt jeden Messpunkt gefiltert zurück.

    Felder:
    - timestamp (YYYY-MM-DD HH:MM:SS, ohne Zeitzone)
    - location_name (Eingang / Bereich)
    - weather_condition
    - pedestrians_count

    Optionale Filter:
    ?start=2023-01-10
    ?end=2023-01-15
    oder kombiniert:
    ?start=2023-01-10&end=2023-01-15
    """

    data = df.copy()

    # Start-Datum Filter
    if start is not None:
        start_dt = pd.to_datetime(start)
        data = data[data["timestamp"] >= start_dt]

    # End-Datum Filter
    if end is not None:
        end_dt = pd.to_datetime(end)
        data = data[data["timestamp"] <= end_dt]

    # JSON erstellen
    ergebnis = []
    for _, row in data.iterrows():
        ergebnis.append(
            {
                # als String ohne Zeitzone zurückgeben
                "timestamp": row["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
                "location_name": row["location_name"],
                "weather_condition": row["weather_condition"],
                "pedestrians_count": int(row["pedestrians_count"]),
            }
        )

    return {"results": ergebnis}
