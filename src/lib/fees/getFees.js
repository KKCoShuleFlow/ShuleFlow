import { supabase } from "../supabase"
import { getOfflineFees, saveFeesOffline } from "../db/feesDB"

export async function getFees() {
  try {
    const { data, error } = await supabase.from("fees").select("*")

    if (error) throw error

    await saveFeesOffline(data || [])

    return data || []
  } catch (err) {
    console.warn("Offline mode activated")
    return await getOfflineFees()
  }
}