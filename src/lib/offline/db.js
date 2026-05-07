import Dexie from "dexie"

export const db = new Dexie("school_finance_db")

db.version(1).stores({
  fees: "id, studentId, updatedAt",
  queue: "++id, type, payload, createdAt",
})