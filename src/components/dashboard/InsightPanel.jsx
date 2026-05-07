import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts"

export default function InsightPanel({ students, fees }) {

  // ----------------------------
  // PAIN POINT DATA ENGINE
  // ----------------------------

  let paid = 0
  let expected = 0
  let overdueCount = 0

  students.forEach(s => {
    const f = fees.filter(x => x.studentId === s.id)

    const exp = f.reduce((a, b) => a + Number(b.amount || 0), 0)
    const pd = f.reduce((a, b) => a + Number(b.paid || 0), 0)

    expected += exp
    paid += pd

    if (exp - pd > 0) overdueCount++
  })

  const financeData = [
    { name: "Paid", value: paid },
    { name: "Outstanding", value: expected - paid }
  ]

  const riskData = [
    { name: "Healthy", value: students.length - overdueCount },
    { name: "At Risk", value: overdueCount }
  ]

  const systemData = [
    { name: "Sync", value: 98 },
    { name: "Offline", value: 100 },
    { name: "Latency", value: 92 }
  ]

  const COLORS = ["#4f46e5", "#ef4444"]

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 16,
      marginTop: 20
    
    }}>

      {/* 🔴 FINANCE PAIN */}
      <Card title="Financial Risk">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={financeData} dataKey="value" outerRadius={60}>
              {financeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🟡 STUDENT RISK */}
      <Card title="Student Risk">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={riskData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🟢 SYSTEM HEALTH */}
      <Card title="System Health">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={systemData}>
            <Line type="monotone" dataKey="value" stroke="#10b981" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Card>

    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: 12,
      padding: 12
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 8
      }}>




  

        {title}
      </div>
      {children}
    </div>
  )
}