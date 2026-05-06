export default function Panel({ title, children }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid rgba(148,163,184,0.2)",
      borderRadius: 14,
      padding: 14
    }}>
      {title && (
        <div style={{
          fontSize: 12,
          fontWeight: 800,
          marginBottom: 10,
          color: "#e2e8f0"
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}