import { useState, useEffect } from 'react'
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi'

export default function Header() {
  // ===== State for live date/time =====
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ===== Format date nicely =====
  const formattedDate = currentTime.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // ===== Dynamic user from localStorage =====
  const [currentUser, setCurrentUser] = useState('User')

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      setCurrentUser(JSON.parse(userData)?.name || 'User')
    }

    // Listen for changes (logout/login from another tab)
    const handleStorage = () => {
      const updatedUser = localStorage.getItem('currentUser')
      setCurrentUser(updatedUser ? JSON.parse(updatedUser)?.name : 'User')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Avatar placeholder (first letter)
  const avatarLetter = currentUser.charAt(0).toUpperCase()

  // ===== Logout handler =====
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    window.location.href = '/'
  }

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-r from-indigo-950 via-purple-900 to-fuchsia-900 border border-white/10 rounded-2xl shadow-lg relative">
      {/* Left Section: Dashboard info */}
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
          Dashboard
        </h1>
        <p className="text-slate-300 mt-1 text-sm md:text-base">
          Welcome back, <span className="font-semibold">{currentUser}</span> 👋
        </p>
        <p className="text-slate-400 mt-1 text-xs md:text-sm font-mono">
          {formattedDate}
        </p>
      </div>

      {/* Right Section: Notifications + User */}
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        {/* Notifications */}
        <button className="relative text-white text-xl hover:text-blue-400 transition-colors">
          <FiBell />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 transition-all hover:bg-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
              {avatarLetter}
            </div>
            <span className="text-white font-medium hidden sm:block">
              {currentUser}
            </span>
            <FiUser className="text-white hidden sm:block" />
          </div>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-red-600 rounded-xl transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
