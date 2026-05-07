export default function FeesReceiptModal({ fee, onClose }) {
  if (!fee) return null

  const downloadReceipt = () => {
    const printContent = `
      RECEIPT
      ------------------
      Student: ${fee.student_name}
      Amount: ${fee.amount}
      Paid: ${fee.paid}
      Balance: ${fee.amount - fee.paid}
      Date: ${new Date().toLocaleDateString()}
    `

    const win = window.open("", "", "width=600,height=600")
    win.document.write(`<pre>${printContent}</pre>`)
    win.print()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Receipt</h3>

        <p><b>Student:</b> {fee.student_name}</p>
        <p><b>Amount:</b> {fee.amount}</p>
        <p><b>Paid:</b> {fee.paid}</p>
        <p><b>Balance:</b> {fee.amount - fee.paid}</p>

        <button onClick={downloadReceipt}>Print / PDF</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)"
  },
  modal: {
    background: "#0f172a",
    padding: 20,
    margin: "10% auto",
    width: 400,
    color: "white"
  }
}