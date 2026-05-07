import { useEffect } from "react"
import { processQueue } from "../../lib/sync/syncEngine"

export function useOfflineSync() {
  useEffect(() => {

    const sync = async () => {
      if (navigator.onLine) {
        await processQueue()
      }
    }

    sync()

    const interval = setInterval(sync, 5000)

    window.addEventListener("online", sync)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", sync)
    }
  }, [])
}