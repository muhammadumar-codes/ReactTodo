// ===== CSS =====
import './styles/style.css'

// ===== React Router =====
import { Routes, Route } from 'react-router-dom'

// ===== Pages =====
import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './pages/NotFound/NotFound'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

// ===== Layouts =====
import DashboardLayout from './layouts/DashBoarrdLayout'
import AuthLayout from './layouts/AuthLayout'

// ===== Route Guards =====
import Private from './routes/Private'
import Redirect from './routes/Redirect'

export default function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<Private />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      <Route element={<Redirect />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
