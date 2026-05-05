import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { db } from "../db" // Assuming Dexie or similar
import { addFeePayment, getStudentFees } from "../features/fees/services/feesService"

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [fees, setFees] = useState([])
  const [amount, setAmount] = useState("")
  const [paidInput, setPaidInput] = useState("")

  // 1. Fetch Student & Fee Data
  useEffect(() => {
    const fetchData = async () => {
      const studentData = await db.students.get(Number(id))
      const feeData = await getStudentFees(Number(id))
      setStudent(studentData)
      setFees(feeData)
    }
    fetchData()
  }, [id])

  // 2. Calculate Totals
  const totalFees = fees.reduce((sum, f) => sum + Number(f.amount || 0), 0)
  const totalPaid = fees.reduce((sum, f) => sum + Number(f.paid || 0), 0)
  const balance = totalFees - totalPaid

  // 3. Handle Add Fee
  const handleFee = async () => {
    if (!amount || !paidInput) return
    const newFee = { 
      studentId: Number(id), 
      amount: Number(amount), 
      paid: Number(paidInput),
      date: new Date().toISOString() 
    }
    await addFeePayment(newFee)
    setFees([...fees, newFee]) // Update UI
    setAmount("")
    setPaidInput("")
  }

  if (!student) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <Link to="/students" className="text-blue-600">← Back</Link>

      <div className="bg-white p-6 rounded-xl shadow mt-4">
        <h2 className="text-xl font-bold mb-4">👤 Student Profile</h2>
        <p><b>Name:</b> {student.name}</p>
        <p><b>Class:</b> {student.class}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h3 className="font-semibold mb-4">💰 Fees</h3>
        
        <div className="flex gap-2 mb-4">
          <input 
            placeholder="Total Amount" 
            type="number"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="border p-2 rounded w-full" 
          />
          <input 
            placeholder="Paid Amount" 
            type="number"
            value={paidInput} 
            onChange={(e) => setPaidInput(e.target.value)} 
            className="border p-2 rounded w-full" 
          />
          <button onClick={handleFee} className="bg-blue-600 text-white px-4 rounded">
            Add
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p>Total: {totalFees}</p>
          <p>Paid: {totalPaid}</p>
          <p className="font-bold">Balance: {balance}</p>
        </div>

        {fees.map((f, index) => (
          <div key={index} className="border-b py-2 text-sm flex justify-between">
            <span>Paid: {f.paid}</span>
            <span className="text-gray-400">of {f.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
