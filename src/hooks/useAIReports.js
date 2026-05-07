import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { buildAIReport } from "../lib/reports/aiReportEngine"

export function useAIReports() {
  const [report, setReport] = useState(null)

  const load = async () => {
    const [{ data: students }, { data: fees }, { data: attendance }] =
      await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("fees").select("*"),
        supabase.from("attendance").select("*")
      ])

    setReport(
      buildAIReport({
        students,
        fees,
        attendance
      })
    )
  }

  useEffect(() => {
    load()
  }, [])

  return { report, reload: load }
}