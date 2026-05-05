export function calculateDropoutRisk(students, fees) {
  const studentRiskMap = []

  students.forEach(student => {
    const sFees = fees.filter(f => f.studentId === student.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid

    // ----------------------------
    // BASE RISK SCORE
    // ----------------------------
    let risk = 10 // baseline (no student is 0 risk in real life)

    // ----------------------------
    // PAYMENT RISK
    // ----------------------------
    if (expected > 0) {
      const paymentRatio = paid / expected

      if (paymentRatio >= 0.9) risk += 5
      else if (paymentRatio >= 0.7) risk += 20
      else if (paymentRatio >= 0.4) risk += 40
      else risk += 60
    } else {
      risk += 20 // no payment history = uncertainty risk
    }

    // ----------------------------
    // DEBT PENALTY
    // ----------------------------
    if (balance > 0) {
      risk += Math.min(30, balance / 1000) // scale debt impact
    }

    // ----------------------------
    // CLAMP SCORE (0–100)
    // ----------------------------
    risk = Math.max(0, Math.min(100, Math.round(risk)))

    studentRiskMap.push({
      id: student.id,
      name: student.name,
      risk,
      balance
    })
  })

  // sort highest risk first
  studentRiskMap.sort((a, b) => b.risk - a.risk)

  return {
    students: studentRiskMap,
    mostAtRisk: studentRiskMap[0] || null
  }
}