import Dexie from "dexie"

export const db = new Dexie("ShuleFlowDB")

db.version(1).stores({
  students: "id, name, class, created_at, updated_at",
  fees: "id, studentId, amount, paid, status, created_at, updated_at",
  attendance: "id, studentId, date, status, created_at, updated_at",
})

/* ---------------- VERSION 2 (SYNC READY) ---------------- */
db.version(2).stores({
  students: "id, name, class, sync_status, updated_at",
  fees: "id, studentId, amount, paid, status, sync_status, updated_at",
  attendance: "id, studentId, date, status, sync_status, updated_at",
})

/* ---------------- VERSION 3 (ENTERPRISE READY) ---------------- */
db.version(3).stores({
  students: "id, school_id, name, class, sync_status, updated_at",
  fees: "id, school_id, studentId, amount, paid, status, sync_status, updated_at",
  attendance: "id, school_id, studentId, date, status, sync_status, updated_at",

  // 🔥 sync tracking
  sync_queue: "++id, table, action, payload, status, created_at",

  // 🔥 system logs (for observability dashboard)
  logs: "++id, type, message, created_at"
})