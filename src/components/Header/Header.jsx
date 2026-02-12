import { useState, useEffect } from 'react'

export default function Header() {
  // ===== State for date/time =====
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ===== Format date nicely =====
  const formattedDate = currentTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // ===== Dynamic user from localStorage =====
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      setCurrentUser(JSON.parse(userData)?.name || 'User')
    }
  }, [])

  return (
    <header className="rounded-2xl p-6 bg-gradient-to-r from-indigo-950 via-purple-900 to-fuchsia-900 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
      {/* Welcome message */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Dashboard
        </h1>
        <p className="text-slate-300 mt-1 text-sm md:text-base">
          Welcome back,{' '}
          <span className="font-semibold">{currentUser || 'User'}</span> 👋
        </p>
      </div>

      {/* Current date/time */}
      <div className="mt-4 md:mt-0 text-white text-sm md:text-base text-right font-mono">
        {formattedDate}
      </div>
    </header>
  )
}
