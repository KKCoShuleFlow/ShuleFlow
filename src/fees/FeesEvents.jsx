import { formatEvent } from "../lib/event/formatEvent"

export default function FeesEvents({ events }) {
  return (
    <div style={styles.box}>
      <h3>📡 Live Finance Events</h3>

      {events.length === 0 && (
        <div>No activity yet...</div>
      )}

      {events.map((e, i) => (
        <div key={i}>
          [{e.time}] {formatEvent(e)}
        </div>
      ))}
    </div>
  )
}

const styles = {
  box: {
    background: "#0f172a",
    padding: 16,
    borderRadius: 12
  }
}