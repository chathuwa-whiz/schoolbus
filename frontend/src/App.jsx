import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './home/Home'
import ParentRegister from './parent/Register'
import ParentLogin from './parent/Login'
import ParentDashboardLayout from './parent/DashboardLayout'

// Dashboard components
import Overview from './parent/components/Overview'
import Children from './parent/components/Children'
import Tracking from './parent/components/Tracking'
import AttendanceHistory from './parent/components/AttendanceHistory'
import Payments from './parent/components/Payment'
import Notifications from './parent/components/Notifications'
import Settings from './parent/components/Settings'

// Auth guard for protected routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/parent/login" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/parent/register" element={<ParentRegister />} />
        <Route path="/parent/login" element={<ParentLogin />} />
        
        {/* Protected parent routes */}
        <Route path="/parent" element={
          <ProtectedRoute>
            <ParentDashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="children" element={<Children />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="attendance" element={<AttendanceHistory />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        
        {/* Catch all route - 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
