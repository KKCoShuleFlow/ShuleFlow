import { processSyncQueue } from "../db/processSync"

export function subscribeNetwork() {
  window.addEventListener("online", async () => {
    console.log("BACK ONLINE → syncing...")
    await processSyncQueue()
  })
}