import { db } from "../../../db"

export async function getClassFeeSummary() {
  const fees = await db.fees.toArray()

  const summary = {}

  fees.forEach(f => {
    if (!summary[f.studentId]) {
      summary[f.studentId] = {
        total: 0,
        paid: 0
      }
    }

    summary[f.studentId].total += Number(f.amount)
    summary[f.studentId].paid += Number(f.paid)
  })

  return summary
}