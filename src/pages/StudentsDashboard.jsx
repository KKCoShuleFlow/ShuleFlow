import { useEffect, useState } from "react"
import { db } from "../db"
import { subscribeFees, subscribeStudents } from "../lib/realtimePain"
import { calculateDropoutRisk } from "../lib/dropoutAI"

export default function StudentsDashboard() {
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ----------------------------
  // INIT + REALTIME SYNC
  // ----------------------------
  useEffect(() => {
    let unsub1
    let unsub2

    async function init() {
      try {
        const s = await db.students.toArray()
        const f = await db.fees.toArray()

        setStudents(s || [])
        setFees(f || [])
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load students data")
        setLoading(false)
      }
    }

    init()

    try {
      unsub1 = subscribeStudents(async () => {
        const s = await db.students.toArray()
        setStudents(s || [])
      })

      unsub2 = subscribeFees(async () => {
        const f = await db.fees.toArray()
        setFees(f || [])
      })
    } catch (err) {
      console.error("Realtime error:", err)
    }

    return () => {
      if (unsub1) unsub1()
      if (unsub2) unsub2()
    }
  }, [])

  // ----------------------------
  // AI DROP OUT RISK ENGINE
  // ----------------------------
  useEffect(() => {
    try {
      if (!students.length && !fees.length) return

      const result = calculateDropoutRisk(students || [], fees || [])

      setAnalysis(result)
    } catch (err) {
      console.error(err)
      setError("Risk engine failed")
    }
  }, [students, fees])

  // ----------------------------
  // ERROR STATE
  // ----------------------------
  if (error) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        ⚠️ {error}
      </div>
    )
  }

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (loading || !analysis) {
    return (
      <div style={{ padding: 24 }}>
        ⚡ Calculating student risk intelligence...
      </div>
    )
  }

  const top = analysis.mostAtRisk

  return (
    <div style={{ padding: 24 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          Student Dropout Risk Engine
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Live prediction of student retention risk
        </div>
      </div>

      {/* 🔴 TOP RISK STUDENT */}
      <div style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16
      }}>

        <div style={{ fontSize: 14, fontWeight: 600 }}>
          🔴 Highest Risk Student
        </div>

        <div style={{ marginTop: 6, fontSize: 13 }}>
          Name: <b>{top?.name || "N/A"}</b>
        </div>

        <div style={{ fontSize: 13 }}>
          Risk Score:{" "}
          <b style={{
            color:
              top?.risk > 70 ? "red" :
              top?.risk > 40 ? "orange" :
              "green"
          }}>
            {top?.risk || 0}/100
          </b>
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          Outstanding Balance: {top?.balance || 0}
        </div>

      </div>

      {/* 📊 RISK LIST */}
      <div style={{ marginBottom: 20 }}>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          Student Risk Ranking
        </div>

        {analysis.students.slice(0, 8).map((s) => (
          <div key={s.id} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 10,
            marginBottom: 8
          }}>

            <span>{s.name}</span>

            <span style={{
              fontWeight: 600,
              color:
                s.risk > 70 ? "red" :
                s.risk > 40 ? "orange" :
                "green"
            }}>
              {s.risk}/100
            </span>

          </div>
        ))}

      </div>

      {/* 🧠 AI INSIGHT */}
      <div style={{
        padding: 14,
        borderRadius: 12,
        background: "rgba(239, 68, 68, 0.05)",
        border: "1px solid rgba(239, 68, 68, 0.15)"
      }}>

        <div style={{ fontSize: 13, fontWeight: 600 }}>
          🧠 Dropout Intelligence Insight
        </div>

        <div style={{ fontSize: 13, marginTop: 6 }}>
          The system identifies <b>{top?.name || "no student"}</b> as highest risk
          based on payment behavior and outstanding balances.
        </div>

        <div style={{
          marginTop: 8,
          fontSize: 11,
          color: "#64748b"
        }}>
          Risk model: payment ratio + debt pressure + consistency score
        </div>

      </div>

    </div>
  )
}