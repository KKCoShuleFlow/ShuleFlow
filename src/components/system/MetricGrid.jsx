import Card from "../ui/Card"

export default function MetricGrid({ metrics }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      {metrics.map((m, i) => (
        <Card
          key={i}
          label={m.label}
          value={m.value}
          color={m.color}
        />
      ))}
    </div>
  )
}