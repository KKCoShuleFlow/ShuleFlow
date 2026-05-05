import { db } from "../../db"

export async function addToQueue(action) {
  await db.syncQueue.add({
    id: crypto.randomUUID(),
    type: action.type,
    payload: action.payload,
    status: "pending",
    timestamp: Date.now(),
    retries: 0
  })
}

export async function getPendingActions() {
  return await db.syncQueue
    .where("status")
    .equals("pending")
    .toArray()
}

export async function markAsSynced(id) {
  await db.syncQueue.update(id, { status: "synced" })
}

export async function markAsFailed(id) {
  await db.syncQueue.update(id, { status: "failed" })
}