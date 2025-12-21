import { useState } from "react";

export default function Filterpanel({ onFilterChange }) {
  const [standort, setStandort] = useState("");
  const [startDatum, setStartDatum] = useState("");
  const [endDatum, setEndDatum] = useState("");

  const anwenden = () => {
    onFilterChange({ standort, startDatum, endDatum });
  };

  return (
    <div className="filterpanel">
      <h3>Filter</h3>

      <label>Standort:</label>
      <select value={standort} onChange={(e) => setStandort(e.target.value)}>
        <option value="">-- Standort wählen --</option>
        <option>Bahnhofstrasse Nord</option>
        <option>Bahnhofstrasse Mitte</option>
        <option>Bahnhofstrasse Süd</option>
        <option>Lintheschergasse</option>
      </select>

      <label>Datum von:</label>
      <input
        type="date"
        value={startDatum}
        onChange={(e) => setStartDatum(e.target.value)}
      />

      <label>Datum bis:</label>
      <input
        type="date"
        value={endDatum}
        onChange={(e) => setEndDatum(e.target.value)}
      />

      <button onClick={anwenden}>Anwenden</button>
    </div>
  );
}
