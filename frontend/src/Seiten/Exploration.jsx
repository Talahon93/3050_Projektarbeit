import { useState } from "react";
import Filterpanel from "../Komponenten/Filterpanel";
import WetterChart from "../Charts/Wetter";
import "../Styles/explore.css";

export default function Exploration() {
  const [filter, setFilter] = useState({
    standort: "",
    startDatum: "",
    endDatum: "",
  });

  return (
    <div className="analyse-container">
      <div className="filter-wrapper">
        <Filterpanel onFilterChange={setFilter} />
      </div>

      <div className="chart-area">
        <WetterChart filter={filter} />
      </div>
    </div>
  );
}
