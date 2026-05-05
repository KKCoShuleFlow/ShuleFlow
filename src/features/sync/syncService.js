import { db } from "../db"
import { supabase } from "../lib/supabase"

export async function syncData() {
  try {
    const students = await db.students.toArray();
    const fees = await db.fees.toArray();

    // Perform bulk upserts instead of loops
    if (students.length > 0) {
      await supabase.from("students").upsert(students);
    }
    if (fees.length > 0) {
      await supabase.from("fees").upsert(fees);
    }

    // Update local sync status
    await db.settings.put({ id: "sync_info", lastSynced: new Date(), status: "success" });
    console.log("✅ SYNC COMPLETE");
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
  }
}

