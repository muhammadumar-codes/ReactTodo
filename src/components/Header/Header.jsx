import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiMoon,
  FiSun,
  FiChevronDown,
} from 'react-icons/fi'
import { MdDashboard, MdNotificationsActive } from 'react-icons/md'

import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentUser, setCurrentUser] = useState('User')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New todo added', time: '2 min ago', read: false },
    { id: 2, text: 'Task completed', time: '1 hour ago', read: false },
    { id: 3, text: 'Welcome back!', time: '1 day ago', read: true },
  ])
  const dropdownRef = useRef(null)
  const notificationsRef = useRef(null)

  // ===== Live date/time with formatting =====
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ===== Load user data and theme preference =====
  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      setCurrentUser(JSON.parse(userData)?.name || 'User')
    }

    // Listen for storage changes (login/logout from another tab)
    const handleStorage = () => {
      const updatedUser = localStorage.getItem('currentUser')
      setCurrentUser(updatedUser ? JSON.parse(updatedUser)?.name : 'User')
    }
    window.addEventListener('storage', handleStorage)

    // Load theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // ===== Click outside handlers for dropdowns =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  // ===== Avatar placeholder =====
  const avatarLetter = currentUser.charAt(0).toUpperCase()

  // ===== Unread notifications count =====
  const unreadCount = notifications.filter((n) => !n.read).length

  // ===== Logout handler =====
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  // ===== Mark notification as read =====
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // ===== Mark all as read =====
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  // ===== Toggle dark mode =====
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
    >
      {/* Left Section: Dashboard info with animated icon */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg"
        >
          <MdDashboard className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back,{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentUser}
              </span>
            </p>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              className="text-lg"
            >
              👋
            </motion.span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiSun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiMoon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications with dropdown */}
        <div className="relative" ref={notificationsRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MdNotificationsActive className="w-5 h-5 text-blue-500" />
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all ${
                          !notification.read
                            ? 'bg-blue-50/50 dark:bg-blue-900/20'
                            : ''
                        }`}
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-200 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {avatarLetter}
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium hidden sm:block">
              {currentUser}
            </span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
              >
                {/* User info header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentUser.toLowerCase()}@example.com
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      navigate('/profile')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      navigate('/settings')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      window.open('/help', '_blank')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                  >
                    <FiHelpCircle className="w-4 h-4" />
                    Help
                  </motion.button>

                  <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
