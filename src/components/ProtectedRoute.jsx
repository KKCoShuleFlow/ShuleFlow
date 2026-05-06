import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ role, children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && profile?.role !== role) {
    return <div>🚫 Access denied</div>
  }

  return children ? children : <Outlet />
}