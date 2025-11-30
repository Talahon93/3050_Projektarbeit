import { useState } from "react";
import "../Styles/filterpanel.css";

export default function Filterpanel({ onFilterChange }) {
  const [standort, setStandort] = useState("Bahnhofstrasse Nord");
  const [wetter, setWetter] = useState("klar");
  const [datum, setDatum] = useState("");

  const anwenden = () => {
    onFilterChange({ standort, wetter, datum });
  };

  return (
    <div className="filterpanel">
      <h3>Filter</h3>

      <label>Standort:</label>
      <select value={standort} onChange={(e) => setStandort(e.target.value)}>
        <option>Bahnhofstrasse Nord</option>
        <option>Bahnhofstrasse Mitte</option>
        <option>Bahnhofstrasse Süd</option>
        <option>Lintheschergasse</option>
      </select>

      <label>Wetter:</label>
      <select value={wetter} onChange={(e) => setWetter(e.target.value)}>
        <option value="klar">Klar</option>
        <option value="bewoelkt">Bewölkt</option>
        <option value="regen">Regen</option>
        <option value="nebel">Nebel</option>
      </select>

      <label>Datum:</label>
      <input
        type="date"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
      />

      <button onClick={anwenden}>Anwenden</button>
    </div>
  );
}
