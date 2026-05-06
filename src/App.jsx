import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

// PAGES
import HomeDashboard from "./pages/HomeDashboard"
import StudentsDashboard from "./pages/StudentsDashboard"
import StudentsList from "./pages/StudentsList"
import StudentDetail from "./pages/StudentDetail"

import FeesDashboard from "./pages/FeesDashboard"
import AttendanceDashboard from "./pages/AttendanceDashboard"
import AlertsDashboard from "./pages/AlertsDashboard"
import ReportsDashboard from "./pages/ReportsDashboard"
import InsightsDashboard from "./pages/InsightsDashboard"
import SystemhealthDashboard from "./pages/SystemhealthDashboard"
import SyncStatusDashboard from "./pages/SyncStatusDashboard"
import SettingsDashboard from "./pages/SettingsDashboard"

export default function App() {
  return (
    <Routes>

      {/* APP SHELL (LAYOUT WRAPS EVERYTHING) */}
      <Route element={<Layout />}>
        
        <Route path="/" element={<HomeDashboard />} />

        <Route path="/students" element={<StudentsDashboard />} />
        <Route path="/students/list" element={<StudentsList />} />
        <Route path="/students/:id" element={<StudentDetail />} />

        <Route path="/fees" element={<FeesDashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/alerts" element={<AlertsDashboard />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/insights" element={<InsightsDashboard />} />

        <Route path="/system" element={<SystemhealthDashboard />} />
        <Route path="/sync" element={<SyncStatusDashboard />} />
        <Route path="/settings" element={<SettingsDashboard />} />

      </Route>

    </Routes>
  )
}