import Dexie from "dexie"

export const db = new Dexie("ShuleFlowDB")

db.version(1).stores({
  students: "++id, name, class",
  fees: "++id, studentId, amount, paid",
  attendance: "++id, studentId, date, status" // ✅ THIS IS CORRECT
})