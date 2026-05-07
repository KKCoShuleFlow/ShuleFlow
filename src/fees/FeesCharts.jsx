import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

export default function FeesCharts({ fees = [] }) {
  // 🛡️ safety layer (prevents crash ALWAYS)
  const safeFees = Array.isArray(fees) ? fees : []

  const revenueByStudent = safeFees.map((f) => ({
    name: f.student_name || "Unknown",
    paid: Number(f.paid || 0),
    balance: Number(f.amount || 0) - Number(f.paid || 0)
  }))

  const statusData = [
    {
      name: "Paid",
      value: safeFees.filter(f => Number(f.paid) >= Number(f.amount)).length
    },
    {
      name: "Pending",
      value: safeFees.filter(f => Number(f.paid || 0) < Number(f.amount || 0)).length
    }
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  return (
    <div style={styles.wrapper}>

      {/* BAR CHART */}
      <div style={styles.card}>
        <h3>Revenue per Student</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueByStudent}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="paid" fill="#22c55e" />
            <Bar dataKey="balance" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div style={styles.card}>
        <h3>Payment Status</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 16
  },

  card: {
    background: "#0f172a",
    padding: 16,
    borderRadius: 12
  }
}




