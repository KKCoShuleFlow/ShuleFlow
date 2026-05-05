import { useEffect, useState } from "react"

export default function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)

    window.addEventListener("online", update)
    window.addEventListener("offline", update)

    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  if (online) return null

  return (
    <div style={{
      position: "fixed",
      top: 10,
      right: 10,
      background: "#ef4444",
      color: "white",
      padding: "6px 10px",
      borderRadius: 6,
      fontSize: 12
    }}>
      OFFLINE MODE
    </div>
  )
}