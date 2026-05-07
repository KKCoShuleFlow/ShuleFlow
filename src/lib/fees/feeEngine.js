export function buildAccountingState(fees) {
  const now = new Date()

  let totalExpected = 0
  let totalPaid = 0

  const aging = {
    "0-30": 0,
    "31-60": 0,
    "60+": 0
  }

  const enriched = fees.map(f => {
    const paid = Number(f.paid || 0)
    const amount = Number(f.amount || 0)

    totalExpected += amount
    totalPaid += paid

    const balance = amount - paid

    const created = new Date(f.created_at || now)
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24))

    let bucket = "0-30"
    if (days > 60) bucket = "60+"
    else if (days > 30) bucket = "31-60"

    if (balance > 0) aging[bucket] += balance

    return {
      ...f,
      balance,
      status: balance <= 0 ? "PAID" : "PENDING",
      ageDays: days,
      bucket
    }
  })

  return {
    enriched,
    summary: {
      totalExpected,
      totalPaid,
      totalBalance: totalExpected - totalPaid,
      collectionRate: totalExpected ? totalPaid / totalExpected : 0
    },
    aging
  }
}