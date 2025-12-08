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
          className={currentPage === "Fokusfrage" ? "active" : ""}
          onClick={() => setCurrentPage("fokusfrage")}
        >
          Fokusfrage
        </button>

        <button
          className={currentPage === "Exploration" ? "active" : ""}
          onClick={() => setCurrentPage("exploration")}
        >
          Exploration
        </button>
      </nav>
    </header>
  );
}
