import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function AddStudent({ onAdded }) {
  const [name, setName] = useState("")
  const [className, setClassName] = useState("")
  const [loading, setLoading] = useState(false)

  const addStudent = async () => {
    if (!name || !className) return alert("Fill all fields")

    setLoading(true)

    const { error } = await supabase.from("students").insert([
      {
        name,
        class: className
      }
    ])

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Failed to add student")
      return
    }

    setName("")
    setClassName("")

    // 🔥 trigger parent reload
    if (onAdded) onAdded()
  }

  return (
    <div style={styles.box}>
      <input
        placeholder="Student name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Class"
        value={className}
        onChange={e => setClassName(e.target.value)}
        style={styles.input}
      />

      <button onClick={addStudent} style={styles.button}>
        {loading ? "Adding..." : "Add Student"}
      </button>
    </div>
  )
}

const styles = {
  box: {
    display: "flex",
    gap: 10,
    marginBottom: 16
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: "8px 12px",
    background: "#0f172a",
    color: "white",
    borderRadius: 6,
    cursor: "pointer"
  }
}