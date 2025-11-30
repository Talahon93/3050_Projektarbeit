export default function Wetter({ filter }) {
  return (
    <div style={{ padding: "20px" }}>
      <h3>Passanten & Wetter – Diagramm</h3>

      <p>
        <b>Standort:</b> {filter.standort} <br />
        <b>Wetter:</b> {filter.wetter} <br />
        <b>Datum:</b> {filter.datum || "kein Datum gewählt"}
      </p>

      <div
        style={{
          marginTop: "20px",
          height: "300px",
          background: "#ddd",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Diagramm (Altair) kommt später
      </div>
    </div>
  );
}
