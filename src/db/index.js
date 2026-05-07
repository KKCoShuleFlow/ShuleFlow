import Dexie from "dexie"

export const db = new Dexie("ShuleFlowDB")

db.version(1).stores({
  students: "++id, name, class",
  fees: "++id, studentId, amount, paid, status",
  attendance: "++id, studentId, date, status",
  sync_queue: "++id, table, action, status",
  logs: "++id, type, message"
})