import { useEffect } from "react"
import { runSync } from "../features/sync/syncWorker"

export function useSync() {
  useEffect(() => {
    function handleOnline() {
      runSync()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [])
}