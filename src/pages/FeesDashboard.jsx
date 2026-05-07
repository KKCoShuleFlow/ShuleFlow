// import { useEffect, useMemo, useState } from "react"
// import { supabase } from "../lib/supabase"
// import { Bar } from "react-chartjs-2"
// import jsPDF from "jspdf"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js"

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// )

// export default function FeesDashboard() {

//   const [fees, setFees] = useState([])
//   const [events, setEvents] = useState([])

//   const [student, setStudent] = useState("")
//   const [amount, setAmount] = useState("")

//   /* ---------------- LOAD ---------------- */
//   const loadFees = async () => {
//     const { data } = await supabase.from("fees").select("*")
//     setFees(data || [])
//   }

//   useEffect(() => {
//     loadFees()

  
//   useEffect(() => {
//     const stopEngine = startEngineLoop(5000) // runs every 5 sec

//     return () => stopEngine()
//   }, [])

//     const channel = supabase
//       .channel("fees-live")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "fees" },
//         () => loadFees()
//       )
//       .subscribe()

//     return () => supabase.removeChannel(channel)
//   }, [])

//   /* ---------------- DATA ---------------- */
//   const totalPaid = fees.reduce((a, f) => a + Number(f.paid || 0), 0)
//   const totalDue = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
//   const overdue = fees.filter(f => (f.amount - f.paid) > 0).length

//   const students = useMemo(
//     () => [...new Set(fees.map(f => f.student))],
//     [fees]
//   )

//   /* ---------------- PAYMENT ---------------- */
//   const recordPayment = async (selectedStudent) => {
//     if (!selectedStudent || !amount) return

//     const record = fees.find(f => f.student === selectedStudent)

//     await supabase
//       .from("fees")
//       .update({
//         paid: Number(record.paid || 0) + Number(amount)
//       })
//       .eq("student", selectedStudent)

//     generateReceipt(selectedStudent, amount)

//     setEvents(prev => [
//       {
//         time: new Date().toLocaleTimeString(),
//         msg: `💰 Payment: ${selectedStudent}`
//       },
//       ...prev
//     ])

//     setAmount("")
//     setStudent("")
//     loadFees()
//   }

//   /* ---------------- PDF ---------------- */
//   const generateReceipt = (name, amt) => {
//     const doc = new jsPDF()
//     doc.text("SCHOOL RECEIPT", 20, 20)
//     doc.text(`Student: ${name}`, 20, 40)
//     doc.text(`Amount: ${amt}`, 20, 50)
//     doc.text(`Date: ${new Date().toLocaleString()}`, 20, 60)
//     doc.save(`receipt_${name}.pdf`)
//   }

//   /* ---------------- CHART ---------------- */
//   const chartData = {
//     labels: fees.map(f => f.class),
//     datasets: [
//       {
//         label: "Payments",
//         data: fees.map(f => f.paid),
//         backgroundColor: "#6366f1",
//       }
//     ]
//   }

//   return (
//     <div style={styles.wrapper}>

//       {/* HEADER */}
//       <div style={styles.header}>
//         <div style={styles.title}>💰 FEES OS V4</div>
//         <div style={styles.subtitle}>
//           Smart Accounting System for Schools
//         </div>
//       </div>

//       {/* KPI */}
//       <div style={styles.grid}>
//         <Card label="Revenue" value={totalPaid} color="#22c55e" />
//         <Card label="Expected" value={totalDue} color="#38bdf8" />
//         <Card label="Overdue" value={overdue} color="#ef4444" />
//         <Card label="Records" value={fees.length} color="#f59e0b" />
//       </div>

//       {/* MAIN */}
//       <div style={styles.main}>

//         {/* PAYMENT PANEL */}
//         <div style={styles.panel}>
//           <div style={styles.panelTitle}>⚡ Quick Payment</div>

//           {/* SMART INPUT */}
//           <SmartStudentInput
//   students={students.map(s => s.name)}   // 🔥 IMPORTANT FIX
//   value={student}
//   setValue={setStudent}
// />

//           <input
//             placeholder="Amount"
//             value={amount}
//             onChange={e => setAmount(e.target.value)}
//             style={styles.input}
//           />

//           <button
//             onClick={() => recordPayment(student)}
//             style={styles.btn}
//           >
//             💳 Record + Receipt
//           </button>
//         </div>

//         {/* CHARTS */}
//         <div style={styles.panel}>
//           <div style={styles.panelTitle}>📊 Analytics</div>
//           <Bar data={chartData} />
//         </div>

//         {/* LIVE FEED */}
//         <div style={styles.panel}>
//           <div style={styles.panelTitle}>📡 Audit Trail</div>

//           {events.map((e, i) => (
//             <div key={i} style={styles.event}>
//               [{e.time}] {e.msg}
//             </div>
//           ))}
//         </div>

//       </div>

//       {/* TABLE */}
//       <div style={styles.bottom}>
//         <div style={styles.panelTitle}>📚 Fee Records</div>

//         {fees.map((f, i) => (
//           <div key={i} style={styles.row}>
//             <div>
//               <div>{f.student}</div>
//               <div style={{ fontSize: 11, opacity: 0.6 }}>
//                 {f.class}
//               </div>
//             </div>

//             <div>
//               {f.paid} / {f.amount}
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }

// /* ---------------- SMART INPUT ---------------- */

// function SmartStudentInput({ students, value, setValue }) {
//   const [open, setOpen] = useState(false)

//   const filtered = students.filter(s =>
//     s.toLowerCase().includes((value || "").toLowerCase())
//   )

//   return (
//     <div style={{ position: "relative" }}>

//       {/* INPUT */}
//       <input
//         value={value}
//         placeholder="Search student..."
//         onChange={(e) => {
//           setValue(e.target.value)   // ✅ SINGLE SOURCE OF TRUTH
//           setOpen(true)
//         }}
//         onFocus={() => setOpen(true)}
//         style={styles.input}
//       />

//       {/* DROPDOWN */}
//       {open && value && filtered.length > 0 && (
//         <div style={styles.dropdown}>

//           {filtered.map((s, i) => (
//             <div
//               key={i}
//               style={styles.option}
//               onClick={() => {
//                 setValue(s)     // ✅ inserts name properly
//                 setOpen(false)
//               }}
//             >
//               👤 {s}
//             </div>
//           ))}

//         </div>
//       )}

//     </div>
//   )
// }

// /* ---------------- CARD ---------------- */

// function Card({ label, value, color }) {
//   return (
//     <div style={styles.card}>
//       <div style={styles.cardLabel}>{label}</div>
//       <div style={{ ...styles.cardValue, color }}>
//         {value}
//       </div>
//     </div>
//   )
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//   wrapper: {
//     padding: 20,
//     background: "#050816",
//     height: "100vh",
//     overflow: "auto",
//     color: "white",
//   },

//   header: { marginBottom: 12 },

//   title: { fontSize: 22, fontWeight: 900 },

//   subtitle: { fontSize: 12, opacity: 0.6 },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(4,1fr)",
//     gap: 10,
//     marginBottom: 12,
//   },

//   card: {
//     background: "#0f172a",
//     padding: 12,
//     borderRadius: 10,
//   },

//   cardLabel: { fontSize: 11, opacity: 0.6 },

//   cardValue: { fontSize: 20, fontWeight: 900 },

//   main: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr 1fr",
//     gap: 12,
//   },

//   panel: {
//     background: "#0f172a",
//     padding: 12,
//     borderRadius: 12,
//   },

//   bottom: {
//     marginTop: 12,
//     background: "#0f172a",
//     padding: 12,
//     borderRadius: 12,
//   },

//   panelTitle: {
//     fontSize: 12,
//     fontWeight: 800,
//     marginBottom: 10,
//   },

//   input: {
//     width: "100%",
//     padding: 10,
//     marginBottom: 8,
//     borderRadius: 8,
//     background: "#020617",
//     color: "white",
//     border: "1px solid rgba(255,255,255,0.1)",
//   },

//   btn: {
//     width: "100%",
//     padding: 10,
//     borderRadius: 8,
//     background: "#6366f1",
//     color: "white",
//     border: "none",
//     fontWeight: 800,
//     cursor: "pointer",
//   },

//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: 8,
//     marginBottom: 6,
//     background: "rgba(255,255,255,0.03)",
//     borderRadius: 8,
//   },

//   event: {
//     fontSize: 12,
//     color: "#93c5fd",
//     marginBottom: 6,
//   },

//   dropdown: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     background: "#0f172a",
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 10,
//     zIndex: 10,
//     maxHeight: 200,
//     overflowY: "auto",
//   },

//   option: {
//     padding: 10,
//     cursor: "pointer",
//     fontSize: 13,
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//   },
// }



















import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"
import { Bar } from "react-chartjs-2"
import jsPDF from "jspdf"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

/* ---------------- SMART INPUT ---------------- */
function SmartStudentInput({ students, value, setValue }) {
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!value) return students
    return students.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    )
  }, [value, students])

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        placeholder="Search student..."
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        style={styles.input}
      />

      {open && filtered.length > 0 && (
        <div style={styles.dropdown}>
          {filtered.map((s, i) => (
            <div
              key={i}
              style={styles.option}
              onClick={() => {
                setValue(s)
                setOpen(false)
              }}
            >
              👤 {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- MAIN DASHBOARD ---------------- */

export default function FeesDashboard() {
  const [fees, setFees] = useState([])
  const [student, setStudent] = useState("")
  const [amount, setAmount] = useState("")
  const [events, setEvents] = useState([])

  /* ---------------- LOAD ---------------- */
  const loadFees = async () => {
    const { data } = await supabase.from("fees").select("*")
    setFees(data || [])
  }

  useEffect(() => {
    loadFees()

    const channel = supabase
      .channel("fees-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fees" },
        () => loadFees()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- DERIVED DATA ---------------- */
  const students = useMemo(
    () => [...new Set(fees.map((f) => f.student))],
    [fees]
  )

  const totalPaid = fees.reduce((a, f) => a + Number(f.paid || 0), 0)
  const totalDue = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
  const overdue = fees.filter((f) => (f.amount - f.paid) > 0).length

  /* ---------------- PAYMENT ---------------- */
  const recordPayment = async () => {
    if (!student || !amount) return

    const record = fees.find((f) => f.student === student)

    await supabase
      .from("fees")
      .update({
        paid: Number(record?.paid || 0) + Number(amount),
      })
      .eq("student", student)

    generateReceipt(student, amount)

    setEvents((p) => [
      {
        time: new Date().toLocaleTimeString(),
        msg: `Payment recorded: ${student}`,
      },
      ...p,
    ])

    setAmount("")
    setStudent("")
    loadFees()
  }

  /* ---------------- PDF ---------------- */
  const generateReceipt = (name, amt) => {
    const doc = new jsPDF()
    doc.text("SCHOOL RECEIPT", 20, 20)
    doc.text(`Student: ${name}`, 20, 40)
    doc.text(`Amount: ${amt}`, 20, 50)
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 60)
    doc.save(`receipt_${name}.pdf`)
  }

  /* ---------------- CHART ---------------- */
  const chartData = {
    labels: fees.map((f) => f.class || "N/A"),
    datasets: [
      {
        label: "Payments",
        data: fees.map((f) => f.paid || 0),
        backgroundColor: "#6366f1",
      },
    ],
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>💰 FEES OS (CLEAN v1)</div>
        <div style={styles.subtitle}>
          Stable Accounting System (Supabase Powered)
        </div>
      </div>

      {/* KPI */}
      <div style={styles.grid}>
        <Card label="Revenue" value={totalPaid} color="#22c55e" />
        <Card label="Expected" value={totalDue} color="#38bdf8" />
        <Card label="Overdue" value={overdue} color="#ef4444" />
        <Card label="Records" value={fees.length} color="#f59e0b" />
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* PAYMENT */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>⚡ Quick Payment</div>

          <SmartStudentInput
            students={students}
            value={student}
            setValue={setStudent}
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />

          <button onClick={recordPayment} style={styles.btn}>
            💳 Record Payment
          </button>
        </div>

        {/* CHART */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📊 Analytics</div>
          <Bar data={chartData} />
        </div>

        {/* AUDIT */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📡 Audit Trail</div>

          {events.map((e, i) => (
            <div key={i} style={styles.event}>
              [{e.time}] {e.msg}
            </div>
          ))}
        </div>

      </div>

      {/* TABLE */}
      <div style={styles.bottom}>
        <div style={styles.panelTitle}>📚 Fee Records</div>

        {fees.map((f, i) => (
          <div key={i} style={styles.row}>
            <div>
              <div>{f.student}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>
                {f.class}
              </div>
            </div>

            <div>
              {f.paid} / {f.amount}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

/* ---------------- CARD ---------------- */
function Card({ label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    height: "100vh",
    overflow: "auto",
    color: "white",
  },

  header: { marginBottom: 12 },

  title: { fontSize: 22, fontWeight: 900 },

  subtitle: { fontSize: 12, opacity: 0.6 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 12,
  },

  card: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 10,
  },

  cardLabel: { fontSize: 11, opacity: 0.6 },

  cardValue: { fontSize: 20, fontWeight: 900 },

  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },

  panel: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
  },

  bottom: {
    marginTop: 12,
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    background: "#020617",
    color: "white",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  btn: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "#6366f1",
    color: "white",
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    marginBottom: 6,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
  },

  event: {
    fontSize: 12,
    color: "#93c5fd",
    marginBottom: 6,
  },

  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    zIndex: 10,
    maxHeight: 200,
    overflowY: "auto",
  },

  option: {
    padding: 10,
    cursor: "pointer",
    fontSize: 13,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
}