export default function Card({ label, value, color = "white" }) {
  return (
    <div style={{
      background: "#0b1220",
      border: "1px solid rgba(148,163,184,0.2)",
      borderRadius: 14,
      padding: 14
    }}>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>
        {value}
      </div>
    </div>
  )
}