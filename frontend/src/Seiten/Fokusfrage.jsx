// src/Seiten/Fokusfrage.jsx
import WetterChart from "../Charts/Wetter";
import "../Styles/analyse.css";

export default function Fokusfrage() {
  // Fix definierter Zeitraum: Sommer (Beispiel: Juni–August 2024)
  const sommerFilter = {
    standort: "alle", // oder z.B. "Bahnhofstrasse Nord" falls nur ein Ort
    wetter: "alle", // im Chart nach Wetter gruppieren/anzeigen
    zeitraum: "sommer", // kannst du im Chart intern benutzen, wenn nötig
    startDatum: "2024-01-01",
    endDatum: "2024-12-31",
  };

  return (
    <div className="analyse-container">
      <div className="text-block">
        <h2>Fokusfrage</h2>
        <p>
          Wie verändert sich die Passantenzahl an der Bahnhofsstrasse in
          Abhängigkeit vom Wetter im Zeitraum Juni–August 2024?
        </p>
        <p>
          Die Visualisierung unten zeigt die durchschnittliche Anzahl Passanten
          pro Stunde für die verschiedenen Wetterlagen im Sommer.
        </p>
      </div>

      <div className="chart-area">
        <WetterChart filter={sommerFilter} />
      </div>
    </div>
  );
}
