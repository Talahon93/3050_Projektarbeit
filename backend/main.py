from pathlib import Path
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------------
# Daten laden
# ---------------------------------------------------------

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "Teildatensatz.json"

# Datensatz einlesen
df = pd.read_json(DATA_PATH)

# Datumsspalte erzeugen für komfortable Filter-Abfragen
df["date"] = pd.to_datetime(df[["year", "month", "day"]])

# ---------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------

app = FastAPI(
    title="Passanten & Wetter API",
    description="Projektarbeit: Beeinflusst das Wetter die Passantenzahl?"
)

# CORS aktivieren damit das React Frontend (Vite Port 5173)
# Zugriff auf die API erhält
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Hilfsfunktion: Daten filtern
# ---------------------------------------------------------

def filter_data(location_id=None, start_date=None, end_date=None, hour_from=None, hour_to=None):
    data = df

    if location_id is not None:
        data = data[data["location_id"] == location_id]

    if start_date is not None:
        start = pd.to_datetime(start_date)
        data = data[data["date"] >= start]

    if end_date is not None:
        end = pd.to_datetime(end_date)
        data = data[data["date"] <= end]

    if hour_from is not None:
        data = data[data["hour"] >= hour_from]

    if hour_to is not None:
        data = data[data["hour"] <= hour_to]

    return data


# ---------------------------------------------------------
# Basis Test Endpunkt
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Backend läuft",
        "frage": "Beeinflusst das Wetter die Passantenzahl?"
    }


# ---------------------------------------------------------
# Metadaten Endpunkt
# ---------------------------------------------------------

@app.get("/meta")
def meta():
    locations = (
        df[["location_id", "location_name"]]
        .drop_duplicates()
        .sort_values("location_id")
    )

    return {
        "locations": [
            {
                "id": int(row.location_id),
                "name": row.location_name
            }
            for _, row in locations.iterrows()
        ],
        "weather_conditions": sorted(df["weather_condition"].dropna().unique().tolist()),
        "date_min": df["date"].min().date().isoformat(),
        "date_max": df["date"].max().date().isoformat(),
        "hour_min": int(df["hour"].min()),
        "hour_max": int(df["hour"].max())
    }


# ---------------------------------------------------------
# HAUPTFRAGE
# Das Wetter beeinflusst die Passantenzahl?
# ---------------------------------------------------------

@app.get("/locations/{location_id}/weather-summary")
def weather_summary(
    location_id: int,
    start_date: str = Query(default=None),
    end_date: str = Query(default=None),
    hour_from: int = Query(default=None),
    hour_to: int = Query(default=None)
):
    """
    Übersicht: Passanten pro Wettertyp (für eine Messstation)
    """

    data = filter_data(location_id, start_date, end_date, hour_from, hour_to)

    if data.empty:
        return {
            "location_id": location_id,
            "results": []
        }

    grouped = (
        data.groupby("weather_condition")["pedestrians_count"]
        .agg(
            mean_pedestrians="mean",
            median_pedestrians="median",
            total_pedestrians="sum",
            count_rows="count"
        )
        .reset_index()
        .sort_values("mean_pedestrians", ascending=False)
    )

    # runden für schönere Ausgabe
    grouped["mean_pedestrians"] = grouped["mean_pedestrians"].round(2)
    grouped["median_pedestrians"] = grouped["median_pedestrians"].round(2)

    return {
        "location_id": location_id,
        "filters": {
            "start_date": start_date,
            "end_date": end_date,
            "hour_from": hour_from,
            "hour_to": hour_to
        },
        "results": grouped.to_dict(orient="records")
    }


@app.get("/temperature-correlation")
def temperature_corr(
    location_id: int = Query(default=None),
    start_date: str = Query(default=None),
    end_date: str = Query(default=None),
    hour_from: int = Query(default=None),
    hour_to: int = Query(default=None)
):
    """
    Korrelation Temperatur ↔ Passanten
    """

    data = filter_data(location_id, start_date, end_date, hour_from, hour_to)

    # Sinnvolle Korrelation nur wenn genug Varianz
    if data["temperature"].nunique() < 2 or data["pedestrians_count"].nunique() < 2:
        return {
            "location_id": location_id,
            "pearson_r": None,
            "n": int(len(data)),
            "message": "Zu wenig unterschiedliche Werte für Korrelation"
        }

    r = float(data["temperature"].corr(data["pedestrians_count"]))

    return {
        "location_id": location_id,
        "pearson_r": round(r, 3),
        "n": int(len(data))
    }
