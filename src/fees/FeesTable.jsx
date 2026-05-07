import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function FeesTable({ fees, reload }) {
  const [form, setForm] = useState({
    studentName: "",
    amount: "",
    paid: ""
  })

  const addFee = async () => {
    await supabase.from("fees").insert([form])
    reload()
  }

  return (
    <div style={styles.box}>

      <h3>📋 Fees Records</h3>

      {/* INPUTS */}
      <div style={styles.form}>
        <input placeholder="Student"
          onChange={e => setForm({ ...form, studentName: e.target.value })} />

        <input placeholder="Amount"
          onChange={e => setForm({ ...form, amount: e.target.value })} />

        <input placeholder="Paid"
          onChange={e => setForm({ ...form, paid: e.target.value })} />

        <button onClick={addFee}>Add</button>
      </div>

      {/* TABLE */}
      {fees.map((f, i) => (
        <div key={i} style={styles.row}>
          {f.studentName} — KES {f.amount} / {f.paid}
        </div>
      ))}

    </div>
  )
}

const styles = {
  box: {
    background: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20
  },
  form: {
    display: "flex",
    gap: 8,
    marginBottom: 12
  },
  row: {
    padding: 8,
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  }
}