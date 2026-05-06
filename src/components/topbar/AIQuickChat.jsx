export default function AIQuickChat() {
  return (
    <div style={styles.search}>
      🔍 Ask anything
      <span style={styles.kbd}>Ctrl + K</span>
    </div>
  )
}

const styles = {
  search: {
    display: "flex",
    alignItems: "center",

    background: "rgba(255,255,255,0.05)",
    padding: "6px 12px",
    borderRadius: 10,
    fontSize: 12,
    color: "#cbd5f5",
    border: "1px solid rgba(255,255,255,0.08)",

    whiteSpace: "nowrap",   // 🔥 prevents breaking layout
  },

  kbd: {
    marginLeft: 6,
    padding: "2px 6px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.08)",
    fontSize: 11,
  },
}