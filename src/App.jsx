// import { Routes, Route } from "react-router-dom"
// import layout from "./components/layout"

// import Students from "./pages/StudentsDashboard"
// import StudentDetail from "./pages/StudentDetail"
// import ReportsDashboard from "./pages/ReportsDashboard"
// import AlertsDashboard from "./pages/AlertsDashboard"
// import AttendanceDashboard from "./pages/AttendanceDashboard"
// import FeesDashboard from "./pages/FeesDashboard"
// import InsightsDashboard from "./pages/InsightsDashboard"
// import SystemhealthDashboard from "./pages/SystemhealthDashboard"
// import SyncStatusDashboard from "./pages/SyncStatusDashboard"
// import SettingsDashboard from "./pages/SettingsDashboard"
// import HomeDashboard from "./pages/HomeDashboard"

// export default function App() {
//   return (
//     <Layout>
//       <Routes>
//         <Route path="/students" element={<Students />} />
//         <Route path="/students/:id" element={<StudentDetail />} />
//         <Route path="/reports" element={<ReportsDashboard />} />
//         <Route path="/alerts" element={<AlertsDashboard />} />
//         <Route path="/attendance" element={<AttendanceDashboard />} />
//         <Route path="/fees" element={<FeesDashboard />} />
//         <Route path="/insights" element={<InsightsDashboard />} />

//         <Route path="/system" element={<SystemhealthDashboard />} />

//         <Route path="/sync" element={<SyncStatusDashboard />} />

//          <Route path="/settings" element={<SettingsDashboard />} />
//   <Route path="/" element={<HomeDashboard />} />
//       </Routes>
//     </Layout>
//   )
// }






import { Routes, Route } from "react-router-dom"

import AppLayout from "./components/AppLayout/layout"

import HomeDashboard from "./pages/HomeDashboard"
import Students from "./pages/StudentsDashboard"
import StudentDetail from "./pages/StudentDetail"
import ReportsDashboard from "./pages/ReportsDashboard"
import AlertsDashboard from "./pages/AlertsDashboard"
import AttendanceDashboard from "./pages/AttendanceDashboard"
import FeesDashboard from "./pages/FeesDashboard"
import InsightsDashboard from "./pages/InsightsDashboard"
import SystemhealthDashboard from "./pages/SystemhealthDashboard"
import SyncStatusDashboard from "./pages/SyncStatusDashboard"
import SettingsDashboard from "./pages/SettingsDashboard"

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />

        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />

        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/alerts" element={<AlertsDashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/fees" element={<FeesDashboard />} />
        <Route path="/insights" element={<InsightsDashboard />} />

        <Route path="/system" element={<SystemhealthDashboard />} />
        <Route path="/sync" element={<SyncStatusDashboard />} />
        <Route path="/settings" element={<SettingsDashboard />} />
      </Routes>
    </AppLayout>
  )
}