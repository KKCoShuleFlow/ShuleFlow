import { runIntelligence } from "../intelligence/engine"
import { setStore } from "./store"

export function startEngineLoop(intervalMs = 5000) {
  let active = true
  let intervalId = null

  const run = async () => {
    try {
      if (!active) return

      const data = await runIntelligence()

      console.log("ENGINE RUN:", data)

      if (data) {
        setStore(data)
      }
    } catch (err) {
      console.error("ENGINE ERROR:", err)
    }
  }

  // initial run (instant boot)
  run()

  // continuous loop (real-time intelligence)
  intervalId = setInterval(run, intervalMs)

  // cleanup function (IMPORTANT)
  return () => {
    active = false
    if (intervalId) clearInterval(intervalId)
  }
}