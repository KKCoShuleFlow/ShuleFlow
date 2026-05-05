import { db } from "../../../db"

// ADD PAYMENT
export async function addFeePayment(payment) {
  return await db.fees.add({
    id: crypto.randomUUID(),
    studentId: payment.studentId,
    amount: payment.amount,
    paid: payment.paid,
    date: Date.now()
  })
}

// GET STUDENT FEES
export async function getStudentFees(studentId) {
  return await db.fees
    .where("studentId")
    .equals(studentId)
    .toArray()
}