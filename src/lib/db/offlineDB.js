import Dexie from "dexie"

export const db = new Dexie("schoolOS")

db.version(1).stores({
  fees: "id, studentId, amount, paid",
  students: "id, name, class",
  attendance: "id, studentId, status",
  queue: "++id, type, payload, status"
})