import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className=" flex justify-between w-64 min-h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-700 p-6 flex flex-col">
      
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-white">
        My<span className="text-pink-400">App</span>
      </h1>

      {/* Middle Section (equal spacing) */}
      <div className="flex flex-col gap-4">
        <NavLink to="/" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/profile" className="sidebar-link">
          Profile
        </NavLink>

        <NavLink to="/dashboard/settings" className="sidebar-link">
          Settings
        </NavLink>
      </div>

      {/* Logout */}
      <button
        className="w-full px-4 py-2 rounded-lg
        bg-gradient-to-r from-red-600 to-pink-600
        text-white font-semibold hover:opacity-90 transition cursor-pointer"
      >
        Logout
      </button>
    </aside>
  )
}
