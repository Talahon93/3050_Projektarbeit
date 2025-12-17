import { useEffect, useState } from "react";
import { VegaLite } from "react-vega";

// Datum aus dem Filter ins API-Format bringen
function toApiDate(datum) {
  if (!datum) return null;

  // Fall 1: schon im Format "YYYY-MM-DD"
  if (datum.includes("-")) {
    return datum.slice(0, 10); // nur Datumsteil
  }

  // Fall 2: "DD.MM.YYYY"
  if (datum.includes(".")) {
    const [tag, monat, jahr] = datum.split(".");
    return `${jahr}-${monat}-${tag}`;
  }

  // Fallback: unverändert zurückgeben
  return datum;
}

// Mapping von UI-Standortnamen -> Backend location_name
const locationMap = {
  "Bahnhofstrasse Mitte": "Bahnhofstrasse (Mitte)",
  "Bahnhofstrasse Nord": "Bahnhofstrasse (Nord)",
  "Bahnhofstrasse Süd": "Bahnhofstrasse (Süd)",
  Lintheschergasse: "Lintheschergasse",
};

export default function Wetter({ filter }) {
  const { standort, startDatum, endDatum } = filter;

  const [data, setData] = useState([]);

  useEffect(() => {
    let url = "http://localhost:8000/wetter-uebersicht";

    const params = [];
    const apiStart = toApiDate(startDatum);
    const apiEnd = toApiDate(endDatum);

    if (apiStart) params.push(`start=${apiStart}`);
    if (apiEnd) params.push(`end=${apiEnd}`);

    const backendLocationName = locationMap[standort] || standort || null;

    // WICHTIG: bei "alle" KEIN location_name-Filter setzen
    if (backendLocationName && backendLocationName.toLowerCase() !== "alle") {
      params.push(`location_name=${encodeURIComponent(backendLocationName)}`);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    console.log("API URL:", url);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const results = json.results || [];

        // Wetter-Mapping (EN -> DE)
        const weatherMap = {
          "clear-day": "Sonnig",
          "clear-night": "Klar (Nacht)",
          "partly-cloudy-day": "Leicht bewölkt",
          "partly-cloudy-night": "Leicht bewölkt (Nacht)",
          cloudy: "Bewölkt",
          rain: "Regen",
          wind: "Windig",
          fog: "Nebel",
          snow: "Schnee",
          sleet: "Schneeregen",
        };

        const preparedData = results.map((entry) => ({
          wetter:
            weatherMap[entry.weather_condition] || entry.weather_condition,
          passanten: entry.mean_pedestrians,
        }));

        console.log("Daten für VegaLite:", preparedData);
        setData(preparedData);
      })
      .catch((err) => console.error("Fehler beim Laden:", err));
  }, [standort, startDatum, endDatum]);

  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 700,
    height: 350,
    data: { values: data },
    mark: { type: "bar", cornerRadiusEnd: 4, color: "#3F7FFF" },
    encoding: {
      y: {
        field: "wetter",
        type: "nominal",
        title: "Wetter",
        sort: "-x",
        axis: { labelFontSize: 13, titleFontSize: 14 },
      },
      x: {
        field: "passanten",
        type: "quantitative",
        title: "Ø Passanten",
        axis: { labelFontSize: 13, titleFontSize: 14 },
      },
      tooltip: [
        { field: "wetter", title: "Wetter" },
        { field: "passanten", title: "Ø Passanten" },
      ],
    },
  };

  const standortText =
    standort && standort.toLowerCase() !== "alle" ? standort : "Alle Standorte";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analyse: Passanten & Wetter</h2>

      <p>
        <b>Standort:</b> {standortText} <br />
        <b>Zeitraum:</b>{" "}
        {startDatum && endDatum
          ? `${startDatum} bis ${endDatum}`
          : "Kein Zeitraum gewählt"}
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "20px auto 0",
        }}
      >
        <VegaLite spec={spec} />
      </div>
    </div>
  );
}
