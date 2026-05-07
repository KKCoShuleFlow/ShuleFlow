import Dexie from "dexie"

export const offlineDB = new Dexie("school_offline_db")

offlineDB.version(1).stores({
  fees: "id, studentId, amount, paid, status, updatedAt",
  queue: "++id, type, table, payload, status, createdAt"
})