export default function LiveIndicator() {
  return (
    <div style={{
      display: "inline-block",
      padding: "4px 8px",
      background: "#10b981",
      color: "white",
      borderRadius: 6,
      fontSize: 12
    }}>
      ● LIVE
    </div>
  )
}


export default function Badge({ text, color = "#22c55e" }) {
  return (
    <span style={{
      padding: "4px 8px",
      borderRadius: 999,
      fontSize: 11,
      background: `${color}20`,
      color
    }}>
      {text}
    </span>
  )
}