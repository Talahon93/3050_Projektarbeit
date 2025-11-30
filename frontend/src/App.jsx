import { useState } from "react";
import Header from "./Komponenten/Header";
import Startseite from "./Seiten/Startseite";
import Analyse from "./Seiten/Analyse";
import Explore from "./Seiten/Explore";
import "./Styles/global.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("start");

  return (
    <div>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "start" && <Startseite />}
      {currentPage === "analyse" && <Analyse />}
      {currentPage === "explore" && <Explore />}
    </div>
  );
}
