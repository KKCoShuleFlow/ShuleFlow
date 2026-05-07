export default function FeesOverview({ fees = [] }) {
  // 🛡️ safety guard (prevents crash if undefined ever comes in)
  const safeFees = Array.isArray(fees) ? fees : []

  const totalExpected = safeFees.reduce(
    (sum, f) => sum + Number(f.amount || 0),
    0
  )

  const totalPaid = safeFees.reduce(
    (sum, f) => sum + Number(f.paid || 0),
    0
  )

  const balance = totalExpected - totalPaid

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div>Total Expected</div>
        <h2>{totalExpected.toLocaleString()}</h2>
      </div>

      <div style={styles.card}>
        <div>Total Paid</div>
        <h2>{totalPaid.toLocaleString()}</h2>
      </div>

      <div style={styles.card}>
        <div>Balance</div>
        <h2 style={{ color: balance > 0 ? "#ef4444" : "#22c55e" }}>
          {balance.toLocaleString()}
        </h2>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 16,
  },

  card: {
    background: "#0f172a",
    padding: 16,
    borderRadius: 12,
  },
}
