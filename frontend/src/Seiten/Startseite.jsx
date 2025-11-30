import "../Styles/startseite.css";

export default function Startseite() {
  return (
    <div className="startseite">
      <h1>3050 WebDev und interaktive DatenvisualisierungProjektarbeit</h1>
      <h2>Das Wetter und die Auswirkung auf Passanten</h2>
      <p>
        Dieses Projekt untersucht, wie das Wetter die Anzahl Passanten an
        verschiedenen Standorten in der Stadt Zürich beeinflusst.
      </p>
      <h2>Fokusfrage:</h2>
      <p>
        „Wie beeinflusst das Wetter die Anzahl Passanten an verschiedenen
        Standorten in Zürich?”
      </p>
      <h2>Was findest du wo?</h2>

      <ul>
        <li>
          <b>Analyse:</b> Visualisiert den Zusammenhang zwischen Wetterdaten und
          Passantenzahlen. Filterbar nach Standort, Wetter und Zeitraum.
        </li>

        <li>
          <b>Explore:</b> Freie Exploration aller verfügbaren Daten. Eignet sich
          zum Vergleichen und Entdecken eigener Muster.
        </li>
      </ul>
      <p>Nutze die Navigation oben um eine Ansicht zu wählen.</p>
    </div>
  );
}
