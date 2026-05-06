import Panel from "../ui/Panel"

export default function EventStream({ logs }) {
  return (
    <Panel title="📡 LIVE EVENT STREAM">
      <div style={{
        fontSize: 12,
        color: "#93c5fd",
        lineHeight: 1.8,
        maxHeight: 200,
        overflow: "auto"
      }}>
        {logs.map((l, i) => (
          <div key={i}>
            [{l.time}] {l.msg}
          </div>
        ))}
      </div>
    </Panel>
  )
}