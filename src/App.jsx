// ===== CSS =====
import './styles/style.css'

// ===== Routes =====
import { Routes, Route, Navigate } from 'react-router-dom'

// ===== Pages =====
import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './pages/NotFound/NotFound'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// ===== Layouts =====
import DashboardLayout from './layouts/DashBoarrdLayout'
import AuthLayout from './layouts/AuthLayout'

// ===== Auth Guard =====
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* ===== Auth Routes (NO sidebar) ===== */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {' '}
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* ===== Not Found ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
