export default function Notifications() {
  return (
    <div style={styles.box}>
      <div>🔔 Payment overdue</div>
      <div>⚠️ Attendance drop detected</div>
      <div>🧠 AI suggests follow-up</div>
    </div>
  )
}

const styles = {
  box: {
    position: "fixed",
    right: 20,
    top: 80,
    background: "#0f172a",
    padding: 12,
    borderRadius: 10,
  },
}