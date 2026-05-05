import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./app/layout"

import StudentsList from "./pages/StudentsList"
import StudentDetail from "./pages/StudentDetail"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

import HomeDashboard from "./pages/HomeDashboard"
import StudentsDashboard from "./pages/StudentsDashboard"

export default function App() {
  return (
    <BrowserRouter>
               <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomeDashboard />} />
    
    {/* ADD THIS LINE BELOW */}
    <Route path="/students/dashboard" element={<StudentsDashboard />} /> 
    
    <Route path="/students" element={<StudentsList />} />
    <Route path="/students/:id" element={<StudentDetail />} />
    <Route path="/students-dashboard" element={<StudentsDashboard />} />

    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </Route>
</Routes>

    </BrowserRouter>
  )
}