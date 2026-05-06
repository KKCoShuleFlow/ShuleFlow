export function studentAgent(students, fees, history) {
  let totalRisk = 0
  let highRisk = 0

  students.forEach(s => {
    const risk = Math.random() * 100 // placeholder for your model

    totalRisk += risk
    if (risk > 70) highRisk++
  })

  const avgRisk = students.length ? totalRisk / students.length : 0

  let state = "stable"

  if (avgRisk > 60) state = "critical"
  else if (avgRisk > 40) state = "warning"

  return {
    name: "students",
    avgRisk: Math.round(avgRisk),
    highRisk,
    state,
    signal:
      state === "critical"
        ? "Student dropout wave forming"
        : "Student behavior stable"
  }
}