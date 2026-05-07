export function createEventEngine(setEvents) {
  const push = (type, payload) => {
    const event = {
      id: crypto.randomUUID(),
      type,
      time: new Date().toLocaleTimeString(),
      payload,
    }

    setEvents((prev) => [event, ...prev.slice(0, 30)])
  }

  return {
    studentCreated: (s) =>
      push("student_created", { name: s.name }),

    feePaid: (f) =>
      push("fee_paid", { amount: f.amount, student: f.studentId }),

    attendanceMarked: (a) =>
      push("attendance_marked", { student: a.studentId }),

    system: (msg) =>
      push("system", { msg }),
  }
}