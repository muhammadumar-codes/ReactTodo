// ===== CSS =====
import './styles/style.css'

// ===== Routes =====
import { Routes, Route } from 'react-router-dom'

// ===== Pages =====
import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './pages/NotFound/NotFound'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// ===== Layouts =====
import DashboardLayout from './layouts/DashBoarrdLayout'
import AuthLayout from './layouts/AuthLayout'

export default function App() {
  return (
    <Routes>

      {/* ===== Auth Routes (NO sidebar) ===== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ===== Dashboard Routes (WITH sidebar) ===== */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      {/* ===== Not Found ===== */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}
