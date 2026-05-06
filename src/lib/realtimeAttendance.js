import { db } from "../db"

// Dexie-powered realtime (offline-first friendly)
export function subscribeAttendance(callback) {
  // Initial trigger
  callback()

  // Listen to DB changes
  const handler = () => callback()

  db.on("changes", handler)

  return () => {
    db.on("changes").unsubscribe(handler)
  }
}