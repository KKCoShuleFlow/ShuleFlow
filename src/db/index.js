import Dexie from "dexie"

export const db = new Dexie("schoolERP")

db.version(1).stores({
  students: "++id, name, class",
  fees: "++id, studentId, amount, paid, month"
})