import { useEffect, useState } from "react"
import { db } from "../db"
import { subscribeStudents } from "../lib/realtime"
import { subscribeFees } from "../lib/realtimeFeesFast"

export default function FastDashboard() {
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()

    const unsub1 = subscribeStudents(setStudents)
    const unsub2 = subscribeFees(setFees)

    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  async function init() {
    // 🔥 LOAD ONCE ONLY (FAST BOOT)
    const s = await db.students.toArray()
    const f = await db.fees.toArray()

    setStudents(s)
    setFees(f)

    setLoading(false)
  }

  if (loading) {
    return <h2>⚡ Loading ERP...</h2>
  }

  const revenue = fees.reduce((a, f) => a + Number(f.paid || 0), 0)

  return (
    <div style={{ padding: 20 }}>

      <h1>⚡ FAST REAL-TIME ERP</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <Card title="Students" value={students.length} />
        <Card title="Revenue" value={revenue} />
      </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={{
      flex: 1,
      background: "white",
      padding: 15,
      borderRadius: 10
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  )
}
     function LiveIndicator() {
  return (
    <div style={{
      display: "inline-block",
      padding: "4px 8px",
      background: "#10b981",
      color: "white",
      borderRadius: 6,
      fontSize: 12
    }}>
      ● LIVE
    </div>
  )
}