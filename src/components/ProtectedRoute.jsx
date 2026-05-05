import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login"
      } else {
        setUser(data.user)
      }
    })
  }, [])

  if (!user) return <div>Loading...</div>

  return children
}