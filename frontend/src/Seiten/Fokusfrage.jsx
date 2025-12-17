// src/Seiten/Fokusfrage.jsx
import WetterChart from "../Charts/Wetter";
import "../Styles/analyse.css";

// Die Fokusfrage zeigt Wetter/Passanten im Jahr 2024
export default function Fokusfrage() {
  const fokusfrage = {
    standort: "alle",
    wetter: "alle",
    startDatum: "01.01.2024",
    endDatum: "31.12.2024",
  };

  return (
    <div className="analyse-container">
      <div className="text-block">
        <h2>Fokusfrage</h2>
        <p>
          Wie verändert sich die Passantenzahl an der Bahnhofsstrasse in
          Abhängigkeit vom Wetter im Jahr 2024?
        </p>
        <p>
          Die Visualisierung unten zeigt die durchschnittliche Anzahl Passanten
          pro Messintervall (pro Stunde) für die verschiedenen Wetterlagen im
          Jahr 2024.
        </p>
      </div>

      <div className="chart-area">
        <WetterChart filter={fokusfrage} />
      </div>
      <div className="text-block">
        <p>
          Die Auswertung zeigt, dass bei ungünstigen Wetterlagen deutlich
          weniger Passanten unterwegs sind als bei gutem Wetter. Spannend ist
          auch, dass bei nebligem Wetter am wenigsten Passanten unterwegs sind.
        </p>
      </div>
    </div>
  );
}
