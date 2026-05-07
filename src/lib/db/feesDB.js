import Dexie from "dexie"

export const db = new Dexie("SchoolDB")

db.version(1).stores({
  fees: "id, studentId, amount, paid, status, updatedAt"
})

export async function saveFeesOffline(fees) {
  await db.fees.clear()
  await db.fees.bulkPut(fees)
}

export async function getOfflineFees() {
  return await db.fees.toArray()
}