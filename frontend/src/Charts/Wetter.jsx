import { VegaLite } from "react-vega";
import { mockWeatherSummary } from "../mockWeatherData";

export default function Wetter({ filter }) {
  const { standort, startDatum, endDatum } = filter;

  const weatherMap = {
    "clear-day": "Sonnig",
    "partly-cloudy-day": "Leicht bewölkt",
    cloudy: "Bewölkt",
    rain: "Regen",
    wind: "Windig",
    fog: "Nebel",
    snow: "Schnee",
    sleet: "Schneeregen",
  };

  // Daten aufbereiten
  const data = mockWeatherSummary.map((d) => ({
    wetter: weatherMap[d.weather_condition] || "Unbekannt",
    passanten: d.mean_pedestrians ?? 0,
  }));

  // Horizontaler Balken-Chart
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 700, // breite Darstellung
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analyse: Passanten & Wetter</h2>

      <p>
        <b>Standort:</b> {standort} <br />
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
