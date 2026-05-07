import Panel from "../ui/Panel"

export default function EventStream({ logs }) {
  return (
 <Panel title="📡 LIVE EVENT TIMELINE">

  {events.map((e) => (
    <div key={e.id} style={styles.event}>
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        {e.time} • {e.type}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700 }}>
        {formatEvent(e)}
      </div>
    </div>
  ))}

</Panel>
  )
}