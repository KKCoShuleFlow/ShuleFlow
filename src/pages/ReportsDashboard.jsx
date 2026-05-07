import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"
import { Bar, Doughnut } from "react-chartjs-2"
import jsPDF from "jspdf"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const safeArray = (v) => (Array.isArray(v) ? v : [])
const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}
const normalize = (v) => String(v ?? "").trim().toLowerCase()
const getStudentName = (s) => s?.name || s?.student || s?.student_name || "Unknown"
const getClassName = (s) => s?.class || s?.student_class || s?.grade || "Unassigned"

export default function ReportsDashboard() {
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = async () => {
    try {
      const [{ data: s }, { data: f }, { data: a }, { data: al }] = await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("fees").select("*"),
        supabase.from("attendance").select("*"),
        supabase.from("alerts").select("*"),
      ])

      setStudents(safeArray(s))
      setFees(safeArray(f))
      setAttendance(safeArray(a))
      setAlerts(safeArray(al))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()

    const channel = supabase
      .channel("reports-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        loadAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fees" },
        loadAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        loadAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        loadAll
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const report = useMemo(() => {
    const safeStudents = safeArray(students)
    const safeFees = safeArray(fees)
    const safeAttendance = safeArray(attendance)
    const safeAlerts = safeArray(alerts)

    const totalStudents = safeStudents.length
    const totalDue = safeFees.reduce((sum, f) => sum + toNum(f.amount), 0)
    const totalPaid = safeFees.reduce((sum, f) => sum + toNum(f.paid), 0)
    const outstanding = Math.max(0, totalDue - totalPaid)
    const collectionRate = totalDue ? Math.round((totalPaid / totalDue) * 100) : 0

    const presentCount = safeAttendance.filter((a) => normalize(a.status) === "present").length
    const absentCount = safeAttendance.filter((a) => normalize(a.status) === "absent").length
    const lateCount = safeAttendance.filter((a) => normalize(a.status) === "late").length
    const attendanceTotal = safeAttendance.length
    const attendanceRate = attendanceTotal ? Math.round((presentCount / attendanceTotal) * 100) : 0

    const overdueFees = safeFees.filter((f) => toNum(f.amount) > toNum(f.paid))
    const overdueCount = overdueFees.length

    const classRevenueMap = {}
    safeFees.forEach((f) => {
      const cls = getClassName(f)
      classRevenueMap[cls] = (classRevenueMap[cls] || 0) + toNum(f.paid)
    })

    const topClasses = Object.entries(classRevenueMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    safeAlerts.forEach((a) => {
      const sev = normalize(a.severity || a.level || "low")
      if (severityCounts[sev] === undefined) severityCounts.low += 1
      else severityCounts[sev] += 1
    })

    const topRiskStudents = safeStudents
      .map((s) => {
        const name = getStudentName(s)
        const className = getClassName(s)
        const sid = normalize(String(s.id ?? ""))

        const studentFees = safeFees.filter((f) => {
          const feeName = normalize(f.student || f.student_name || f.studentName)
          const feeSid = normalize(String(f.student_id ?? ""))
          return feeName === normalize(name) || feeName.includes(normalize(name)) || (sid && feeSid === sid)
        })

        const studentAttendance = safeAttendance.filter((a) => {
          const attName = normalize(a.student || a.student_name || a.name)
          const attSid = normalize(String(a.student_id ?? ""))
          return attName === normalize(name) || attName.includes(normalize(name)) || (sid && attSid === sid)
        })

        const studentPaid = studentFees.reduce((sum, f) => sum + toNum(f.paid), 0)
        const studentExpected = studentFees.reduce((sum, f) => sum + toNum(f.amount), 0)
        const balance = Math.max(0, studentExpected - studentPaid)

        const present = studentAttendance.filter((a) => normalize(a.status) === "present").length
        const attRate = studentAttendance.length ? Math.round((present / studentAttendance.length) * 100) : 100

        let risk = 0
        if (balance > 0) risk += 35
        if (attRate < 70) risk += 40
        if (attRate < 50) risk += 15
        if (!studentFees.length) risk += 5

        return {
          name,
          className,
          balance,
          attendanceRate: attRate,
          risk: Math.min(100, risk),
        }
      })
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 8)

    const boardInsight =
      attendanceRate < 60
        ? "Attendance is under pressure and needs intervention."
        : overdueCount > 0
        ? "Finance collection is active, but overdue balances need follow-up."
        : "School operations are stable across finance and attendance."

    const actions = [
      overdueCount > 0 ? "Follow up overdue fee accounts" : "No overdue fee action required",
      attendanceRate < 70 ? "Review low-attendance classes" : "Attendance looks healthy",
      topRiskStudents.length > 0 ? "Monitor high-risk students" : "Risk level is low",
    ]

    return {
      totalStudents,
      totalDue,
      totalPaid,
      outstanding,
      collectionRate,
      attendanceRate,
      presentCount,
      absentCount,
      lateCount,
      overdueCount,
      classRevenueRows: topClasses,
      severityCounts,
      topRiskStudents,
      overdueFees: overdueFees
        .map((f) => ({
          student: getStudentName(f),
          className: getClassName(f),
          amount: toNum(f.amount),
          paid: toNum(f.paid),
          balance: Math.max(0, toNum(f.amount) - toNum(f.paid)),
        }))
        .slice(0, 10),
      boardInsight,
      actions,
      activeAlerts: safeAlerts.length,
      latestAlerts: safeAlerts.slice(0, 8),
    }
  }, [students, fees, attendance, alerts])

  const generateBoardPDF = () => {
    const doc = new jsPDF()
    let y = 16

    const addLine = (text, size = 12, color = "#000000", gap = 8) => {
      doc.setFontSize(size)
      doc.setTextColor(color)
      doc.text(text, 14, y)
      y += gap
      if (y > 275) {
        doc.addPage()
        y = 16
      }
    }

    const addWrapped = (label, value) => {
      const text = `${label}: ${value}`
      const lines = doc.splitTextToSize(text, 180)
      doc.text(lines, 14, y)
      y += lines.length * 6 + 2
      if (y > 275) {
        doc.addPage()
        y = 16
      }
    }

    addLine("SCHOOL BOARD REPORT", 18, "#111111", 12)
    addLine(`Generated: ${new Date().toLocaleString()}`, 10, "#555555", 10)
    addLine(" ", 10, "#ffffff", 6)

    addWrapped("Total Students", report.totalStudents)
    addWrapped("Revenue Collected", report.totalPaid)
    addWrapped("Expected Revenue", report.totalDue)
    addWrapped("Outstanding Balance", report.outstanding)
    addWrapped("Collection Rate", `${report.collectionRate}%`)
    addWrapped("Attendance Rate", `${report.attendanceRate}%`)
    addWrapped("Overdue Fee Records", report.overdueCount)
    addWrapped("Active Alerts", report.activeAlerts)

    addLine(" ", 10, "#ffffff", 6)
    addLine("BOARD INSIGHT", 14, "#111111", 10)
    const insightLines = doc.splitTextToSize(report.boardInsight, 180)
    doc.text(insightLines, 14, y)
    y += insightLines.length * 6 + 4

    addLine(" ", 10, "#ffffff", 6)
    addLine("RECOMMENDED ACTIONS", 14, "#111111", 10)
    report.actions.forEach((a) => {
      const lines = doc.splitTextToSize(`• ${a}`, 180)
      doc.text(lines, 14, y)
      y += lines.length * 6 + 2
    })

    addLine(" ", 10, "#ffffff", 6)
    addLine("TOP RISK STUDENTS", 14, "#111111", 10)
    report.topRiskStudents.slice(0, 6).forEach((s) => {
      addWrapped(`${s.name} (${s.className})`, `Risk ${s.risk}/100 | Balance ${s.balance} | Attendance ${s.attendanceRate}%`)
    })

    doc.save("school-board-report.pdf")
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        📊 Loading Reports Dashboard...
      </div>
    )
  }

  const revenueChart = {
    labels: ["Paid", "Outstanding"],
    datasets: [
      {
        label: "Finance",
        data: [report.totalPaid, report.outstanding],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  }

  const attendanceChart = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        label: "Attendance",
        data: [report.presentCount, report.absentCount, report.lateCount],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
      },
    ],
  }

  const classRevenueChart = {
    labels: report.classRevenueRows.map(([name]) => name),
    datasets: [
      {
        label: "Paid by Class",
        data: report.classRevenueRows.map(([, value]) => value),
        backgroundColor: "#6366f1",
      },
    ],
  }

  const alertsChart = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        data: [
          report.severityCounts.critical,
          report.severityCounts.high,
          report.severityCounts.medium,
          report.severityCounts.low,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#38bdf8", "#22c55e"],
      },
    ],
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>📊 REPORTS COMMAND CENTER</div>
          <div style={styles.subtitle}>
            Board reports, finance intelligence, attendance trends, alerts, and school health
          </div>
        </div>

        <div style={styles.headerActions}>
          <button onClick={loadAll} style={styles.secondaryBtn}>
            Refresh Data
          </button>
          <button onClick={generateBoardPDF} style={styles.primaryBtn}>
            📄 Export Board PDF
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        <Card label="Students" value={report.totalStudents} color="#38bdf8" />
        <Card label="Revenue" value={report.totalPaid} color="#22c55e" />
        <Card label="Outstanding" value={report.outstanding} color="#ef4444" />
        <Card label="Attendance" value={`${report.attendanceRate}%`} color="#f59e0b" />
      </div>

      <div style={styles.main}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>🧠 Board Insight</div>
          <div style={styles.insightBox}>{report.boardInsight}</div>

          <div style={styles.panelTitle}>🎯 Recommended Actions</div>
          <ul style={styles.list}>
            {report.actions.map((a, i) => (
              <li key={i}>→ {a}</li>
            ))}
          </ul>

          <div style={styles.panelTitle}>⚠️ Alerts Summary</div>
          <div style={styles.metricsRow}>
            <MetricChip label="Active Alerts" value={report.activeAlerts} />
            <MetricChip label="Overdue Fees" value={report.overdueCount} />
            <MetricChip label="Risk Students" value={report.topRiskStudents.length} />
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>📊 Charts</div>
          <div style={styles.chartGrid}>
            <div style={styles.chartCard}>
              <div style={styles.chartLabel}>Revenue Overview</div>
              <Bar data={revenueChart} />
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartLabel}>Attendance Breakdown</div>
              <Bar data={attendanceChart} />
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartLabel}>Revenue by Class</div>
              <Bar data={classRevenueChart} />
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartLabel}>Alert Severity</div>
              <Doughnut data={alertsChart} />
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>🚨 Risk & Alerts</div>

          <div style={styles.subTitle}>High Risk Students</div>
          <div style={styles.scrollList}>
            {report.topRiskStudents.length === 0 && (
              <div style={styles.empty}>No risk detected</div>
            )}

            {report.topRiskStudents.map((s, i) => (
              <div key={i} style={styles.riskRow}>
                <div>
                  <div style={styles.name}>{s.name}</div>
                  <div style={styles.sub}>{s.className}</div>
                </div>
                <div style={{ ...styles.riskScore, color: s.risk > 70 ? "#ef4444" : s.risk > 40 ? "#f59e0b" : "#22c55e" }}>
                  {s.risk}%
                </div>
              </div>
            ))}
          </div>

          <div style={styles.subTitle}>Latest Alerts</div>
          <div style={styles.scrollList}>
            {report.latestAlerts.length === 0 && (
              <div style={styles.empty}>No active alerts</div>
            )}

            {report.latestAlerts.map((a, i) => (
              <div key={i} style={styles.alertRow}>
                <div style={styles.name}>
                  {a.type || "alert"}
                </div>
                <div style={styles.sub}>
                  {a.message || a.text || "No message"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.bottomGrid}>
          <div style={styles.panel}>
            <div style={styles.panelTitle}>📚 Overdue Fee Records</div>
            <div style={styles.table}>
              {report.overdueFees.length === 0 && (
                <div style={styles.empty}>No overdue fees</div>
              )}

              {report.overdueFees.map((f, i) => (
                <div key={i} style={styles.tableRow}>
                  <div>
                    <div style={styles.name}>{f.student}</div>
                    <div style={styles.sub}>{f.className}</div>
                  </div>
                  <div style={styles.amount}>
                    {f.paid} / {f.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>📈 Class Revenue Ranking</div>
            <div style={styles.table}>
              {report.classRevenueRows.length === 0 && (
                <div style={styles.empty}>No class revenue data</div>
              )}

              {report.classRevenueRows.map(([cls, value], i) => (
                <div key={i} style={styles.tableRow}>
                  <div>
                    <div style={styles.name}>{cls}</div>
                    <div style={styles.sub}>Revenue contribution</div>
                  </div>
                  <div style={styles.amount}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ label, value, color = "#38bdf8" }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
    </div>
  )
}

function MetricChip({ label, value }) {
  return (
    <div style={styles.metricChip}>
      <div style={styles.metricChipLabel}>{label}</div>
      <div style={styles.metricChipValue}>{value}</div>
    </div>
  )
}

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    color: "white",
    minHeight: "100vh",
    overflow: "auto",
    fontFamily: "Inter",
  },

  loading: {
    padding: 24,
    color: "#60a5fa",
    background: "#050816",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  headerActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  title: {
    fontSize: 22,
    fontWeight: 900,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0f172a",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 12,
  },

  card: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 900,
    marginTop: 6,
  },

  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr 1fr",
    gap: 12,
    alignItems: "start",
  },

  panel: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  insightBox: {
    padding: 12,
    borderRadius: 10,
    background: "rgba(99,102,241,0.08)",
    marginBottom: 12,
    lineHeight: 1.6,
  },

  list: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.8,
    fontSize: 13,
  },

  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 8,
    marginTop: 10,
  },

  metricChip: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  metricChipLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  metricChipValue: {
    fontSize: 18,
    fontWeight: 900,
    marginTop: 4,
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  chartCard: {
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    minHeight: 260,
  },

  chartLabel: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  scrollList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 220,
    overflowY: "auto",
    marginBottom: 14,
  },

  riskRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
  },

  alertRow: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(59,130,246,0.08)",
  },

  subTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
    marginTop: 10,
  },

  bottom: {
    marginTop: 12,
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  table: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
  },

  name: {
    fontWeight: 700,
  },

  sub: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 3,
  },

  amount: {
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  empty: {
    fontSize: 13,
    opacity: 0.6,
    padding: "6px 0",
  },
  wrapper: {
  padding: 20,
  background: "#050816",
  color: "white",
  minHeight: "100vh",
  overflow: "auto",
  fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  letterSpacing: "0.2px",
},
title: {
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: "0.5px",
},

subtitle: {
  fontSize: 12,
  opacity: 0.65,
  letterSpacing: "0.3px",
},

cardValue: {
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "0.3px",
},
}