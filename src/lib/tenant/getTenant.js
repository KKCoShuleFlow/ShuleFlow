export function getTenant() {
  // later this comes from auth or subdomain
  return localStorage.getItem("school_id") || "default-school"
}