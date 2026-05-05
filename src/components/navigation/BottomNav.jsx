export default function BottomNav() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      background: "#111827",
      color: "white",
      padding: 14
    }}>
      <Tab label="Home" />
      <Tab label="Students" />
      <Tab label="Fees" />
      <Tab label="More" />
    </div>
  )
}

function Tab({ label }) {
  return <div style={{ fontSize: 12 }}>{label}</div>
}