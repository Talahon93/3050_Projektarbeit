import "../Styles/header.css";

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="logo">Passanten & Wetter</div>
      <nav className="nav">
        <button
          className={currentPage === "start" ? "active" : ""}
          onClick={() => setCurrentPage("start")}
        >
          Startseite
        </button>

        <button
          className={currentPage === "analyse" ? "active" : ""}
          onClick={() => setCurrentPage("analyse")}
        >
          Analyse
        </button>

        <button
          className={currentPage === "explore" ? "active" : ""}
          onClick={() => setCurrentPage("explore")}
        >
          Explore
        </button>
      </nav>
    </header>
  );
}
