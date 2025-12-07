from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------
# Daten laden
# ---------------------------------------------------------

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Teildatensatz.json"

# Datensatz einlesen
df = pd.read_json(DATA_PATH)

# Datum + Uhrzeit als eigener String
df["datetime"] = pd.to_datetime(df["timestamp"]).dt.strftime("%Y-%m-%d %H:%M:%S")

# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Passanten & Wetter API (simple sum)",
    description="Datum+Uhrzeit, Wetterkondition, summierte Passantenzahl"
)

# CORS für dein Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Test Endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Backend läuft",
        "frage": "Beeinflusst das Wetter die Passantenzahl?"
    }


# ---------------------------------------------------------
# Haupt-Endpoint (SUMME pro timestamp + Wetter)
# ---------------------------------------------------------

@app.get("/daten")
def daten():
    """
    Summierte Passantenzahl pro Datum+Uhrzeit über alle Eingänge,
    gruppiert nach Wetterkondition.
    Jede Zeit kommt nur einmal vor.
    """

    # Gruppieren nach datetime + Wetter und SUMME bilden
    grouped = (
        df.groupby(["datetime", "weather_condition"])["pedestrians_count"]
        .sum()                                # <<<<< WICHTIG: Summe statt Durchschnitt
        .reset_index()
        .sort_values("datetime")
    )

    # JSON erstellen
    ergebnis = []
    for _, row in grouped.iterrows():
        ergebnis.append({
            "datetime": row["datetime"],
            "weather_condition": row["weather_condition"],
            "sum_pedestrians": int(row["pedestrians_count"])    # <<<<< Summe als int
        })

    return {"results": ergebnis}
