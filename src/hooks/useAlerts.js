import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { generateAlerts } from "../lib/alerts/alertEngine"

export function useAlerts() {
  const [alerts, setAlerts] = useState([])

  const load = async () => {
    const [{ data: fees }, { data: attendance }, { data: students }] =
      await Promise.all([
        supabase.from("fees").select("*"),
        supabase.from("attendance").select("*"),
        supabase.from("students").select("*")
      ])

    setAlerts(
      generateAlerts({
        fees: fees || [],
        attendance: attendance || [],
        students: students || []
      })
    )
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("alerts-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fees" },
        load
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        load
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { alerts, reload: load }
}