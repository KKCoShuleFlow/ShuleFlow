export default function CommandPalette({ onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.box} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Type a command..."
          style={styles.input}
        />

        <div style={styles.item}>Go to Students</div>
        <div style={styles.item}>View Reports</div>
        <div style={styles.item}>Open Alerts</div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },
  box: {
    width: 500,
    margin: "100px auto",
    background: "#0f172a",
    padding: 16,
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    cursor: "pointer",
  },
}