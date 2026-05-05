// features/auth/hooks/useAdmin.js
export async function checkAdminAccess(user) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    return false;
  }
  return true;
}
