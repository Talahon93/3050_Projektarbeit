import { useState } from "react";
import Header from "./Komponenten/Header";
import Startseite from "./Seiten/Startseite";
import Fokusfrage from "./Seiten/Fokusfrage";
import Exploration from "./Seiten/Exploration";
import Footer from "./Komponenten/Footer";
import "./Styles/global.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("start");

  return (
    <div className="app-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "start" && <Startseite />}
      {currentPage === "Fokusfrage" && <Fokusfrage />}
      {currentPage === "Exploration" && <Exploration />}

      <Footer />
    </div>
  );
}
