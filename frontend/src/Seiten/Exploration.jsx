import { useState } from "react";
import Filterpanel from "../Komponenten/Filterpanel";
import WetterChart from "../Charts/Wetter";
import "../Styles/analyse.css";

export default function Exploration() {
  const [filter, setFilter] = useState({
    standort: "",
    startDatum: "",
    endDatum: "",
  });

  return (
    <div className="analyse-container">
      <Filterpanel onFilterChange={setFilter} />

      <div className="chart-area">
        <WetterChart filter={filter} />
      </div>
    </div>
  );
}
