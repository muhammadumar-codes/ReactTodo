import { useState, useEffect, useRef } from 'react'
import { FiLogOut, FiChevronDown } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentUser, setCurrentUser] = useState('User')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Format date beautifully
  const formattedDate = currentTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setCurrentUser(parsedUser?.name || 'User')
        setAvatarUrl(parsedUser?.avatar || null)
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }

    const handleStorage = () => {
      const updatedUser = localStorage.getItem('currentUser')
      if (updatedUser) {
        try {
          const parsed = JSON.parse(updatedUser)
          setCurrentUser(parsed?.name || 'User')
          setAvatarUrl(parsed?.avatar || null)
        } catch (e) {
          console.error('Failed to parse updated user data')
        }
      } else {
        setCurrentUser('User')
        setAvatarUrl(null)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    return currentUser
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      {/* Left Section - Clean and minimal */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="p-2 bg-blue-600 rounded-lg"
        >
          <MdDashboard className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back,{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {currentUser}
              </span>
            </p>
            <span className="text-sm">👋</span>
          </div>
        </div>
      </div>

      {/* Right Section - Clean profile area */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        {/* Time - Clean and subtle */}
        <div className="hidden lg:block">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            {formattedDate}
          </p>
        </div>

        {/* Profile Dropdown - Clean design */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {getInitials()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </div>

            {/* User name and chevron */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentUser}
              </span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </div>
          </motion.button>

          {/* Dropdown Menu - Clean and minimal */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentUser}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {currentUser.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="p-1">
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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
