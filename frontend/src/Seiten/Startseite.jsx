import "../Styles/startseite.css";

export default function Startseite() {
  return (
    <div className="startseite">
      <h1>Projektarbeit – Passanten & Wetter</h1>

      <p>
        Dieses Projekt untersucht, wie das <b>Wetter</b> die Menge an
        <b> Passanten</b> an verschiedenen Standorten beeinflusst.
      </p>

      <h2>Fragestellung</h2>
      <p>
        <b>
          „Wie beeinflusst das Wetter die Anzahl Passanten an verschiedenen
          Standorten in Zürich?”
        </b>
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

      <p>Nutze oben die Navigation, um eine Ansicht zu wählen.</p>
    </div>
  );
}
