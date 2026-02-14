import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { FaClipboardList } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import {
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaRegCircle,
  FaTrashAlt,
  FaEdit,
  FaUserCircle,
  FaFilter,
  FaCheckDouble,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClipboardCheck,
  FaMicrophone,
  FaStop,
} from 'react-icons/fa'
import { MdDashboard, MdClearAll } from 'react-icons/md'

const API = 'https://todo-backend-api-livid.vercel.app/api'

export default function Dashboard() {
  const [token, setToken] = useState(null)
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'completed', 'pending'
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null) // For delete animation
  const [toast, setToast] = useState({ show: false, message: '', type: '' }) // Custom toast
  const [showClearConfirm, setShowClearConfirm] = useState(false) // Confirmation modal for clear completed

  // Voice recognition states
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const recognitionRef = useRef(null)

  const navigate = useNavigate()

  // ----- Load token -----
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    setToken(savedToken)
  }, [])

  // ----- Auth check & fetch todos -----
  useEffect(() => {
    if (token === null) return
    if (!token) {
      navigate('/')
      return
    }
    fetchTodos()
  }, [token, navigate])

  // ----- Initialize voice recognition -----
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTitle(transcript)
        setIsListening(false)
        showToast('Voice captured! Click "Add Todo" to save.', 'info')
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          showToast(
            'Microphone access denied. Please allow microphone access.',
            'error'
          )
        } else {
          showToast('Voice recognition failed. Please try again.', 'error')
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setVoiceSupported(false)
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // ----- Voice recognition handlers -----
  const startListening = () => {
    if (!voiceSupported) {
      showToast('Voice recognition is not supported in your browser.', 'error')
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      showToast('Listening... Speak your todo now.', 'info')
    } catch (error) {
      console.error('Failed to start recognition:', error)
      showToast('Failed to start voice recognition.', 'error')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort()
      setIsListening(false)
    }
  }

  // ----- Fetch todos -----
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(res.data.todos)
      setLoading(false)
    } catch (err) {
      showToast('Failed to fetch todos. Please try again.', 'error')
      logout()
    }
  }

  // ----- Logout -----
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // ----- Show toast message (auto-hide after 3s) -----
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  // ----- Add todo with animation -----
  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Please enter a todo title', 'error')
      return
    }

    try {
      const res = await axios.post(
        `${API}/todos`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const newTodo = res.data.todo
      setTodos([newTodo, ...todos])
      setTitle('')
      showToast('Todo added successfully!', 'success')
    } catch (err) {
      showToast('Failed to add todo. Please try again.', 'error')
    }
  }

  // ----- Update todo -----
  const updateTodo = async (id, updates) => {
    try {
      const res = await axios.put(`${API}/todos/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(todos.map((todo) => (todo._id === id ? res.data.todo : todo)))
      setEditingId(null)
      setEditTitle('')
      showToast('Todo updated successfully!', 'success')
    } catch (err) {
      showToast('Failed to update todo.', 'error')
    }
  }

  // ----- Delete todo with smooth exit animation -----
  const deleteTodo = async (id) => {
    setDeletingId(id)
    // Wait for animation to finish before API call and removal
    setTimeout(async () => {
      try {
        await axios.delete(`${API}/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTodos(todos.filter((todo) => todo._id !== id))
        showToast('Todo deleted successfully!', 'success')
      } catch (err) {
        showToast('Failed to delete todo.', 'error')
      } finally {
        setDeletingId(null)
      }
    }, 300) // Match animation duration
  }

  // ----- Toggle todo status (with optimistic UI) -----
  const toggleTodoStatus = async (id, currentStatus) => {
    // Optimistic update
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !currentStatus } : todo
    )
    setTodos(updatedTodos)

    try {
      await axios.put(
        `${API}/todos/${id}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showToast(
        `Todo marked as ${!currentStatus ? 'completed' : 'pending'}!`,
        'success'
      )
    } catch (err) {
      // Rollback on error
      setTodos(todos)
      showToast('Failed to update todo status.', 'error')
    }
  }

  // ----- Clear completed todos with confirmation and batch animation -----
  const clearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t._id)
    if (completedIds.length === 0) {
      showToast('No completed todos to clear.', 'info')
      return
    }

    // Optimistic removal with animation
    setTodos(todos.filter((t) => !t.completed))
    setShowClearConfirm(false)
    showToast(`Cleared ${completedIds.length} completed todos.`, 'success')

    // Actually delete from backend (fire and forget)
    try {
      await Promise.all(
        completedIds.map((id) =>
          axios.delete(`${API}/todos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )
    } catch (err) {
      showToast('Some todos could not be cleared. Please refresh.', 'error')
      fetchTodos() // Revert to server state
    }
  }

  // ----- Start editing -----
  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditTitle(todo.title)
  }

  // ----- Cancel editing -----
  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
  }

  // ----- Filter & search logic -----
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed' && !todo.completed) return false
    if (filter === 'pending' && todo.completed) return false
    if (search && !todo.title.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })

  // ----- Statistics -----
  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.filter((todo) => !todo.completed).length
  const completionPercentage = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0

  // ----- Loading skeleton with shimmer effect -----
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-14 bg-gray-100 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* --- Toast Notification (Industry standard) --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : toast.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="w-5 h-5" />
            ) : toast.type === 'error' ? (
              <FaExclamationTriangle className="w-5 h-5" />
            ) : (
              <FaClipboardCheck className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Dashboard Card (Glassmorphism) --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 md:p-8 mb-8"
      >
        {/* --- Header with user greeting --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <MdDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Dashboard
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <FaClipboardCheck className="text-blue-500" />
                Stay organized and productive
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white/50">
            <FaUserCircle className="w-8 h-8 text-gray-600" />
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back!</p>
              <p className="font-bold text-gray-800">
                {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
              </p>
            </div>
          </div>
        </div>

        {/* --- Stats Cards with icons & progress bar --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-200/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-800">
                  {todos.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200/50 rounded-xl flex items-center justify-center">
                <FaClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-2xl border border-green-200/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200/50 rounded-xl flex items-center justify-center">
                <FaCheckDouble className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-2xl border border-orange-200/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-200/50 rounded-xl flex items-center justify-center">
                <FaClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* --- Progress bar (micro-interaction) --- */}
        {todos.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-medium text-gray-700">
                Overall progress
              </span>
              <span className="font-bold text-blue-600">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-3 bg-gray-200/80 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        )}

        {/* --- Add Todo Form with icon, floating effect, and voice input --- */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening... Speak now'
                    : 'What needs to be done?'
                }
                className="w-full px-6 py-4 pl-14 pr-14 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <FaClipboardList className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              {/* Voice input button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? (
                  <FaStop className="w-4 h-4" />
                ) : (
                  <FaMicrophone className="w-4 h-4" />
                )}
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaPlus className="w-5 h-5" />
              Add Todo
            </motion.button>
          </div>

          {/* Voice hint */}
          {!voiceSupported && (
            <p className="text-xs text-yellow-600 mt-2">
              ⚠️ Voice recognition is not supported in your browser. Please use
              Chrome, Edge, or Safari.
            </p>
          )}
        </form>

        {/* --- Filter & Search bar with icons --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search todos..."
              className="w-full px-6 py-3.5 pl-12 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 outline-none transition-all"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex gap-2 items-center">
            <FaFilter className="text-gray-400 w-5 h-5" />
            {['all', 'pending', 'completed'].map((f) => (
              <motion.button
                key={f}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200/50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* --- Clear Completed Button (with confirmation modal) --- */}
        {completedCount > 0 && (
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-sm"
            >
              <MdClearAll className="w-5 h-5" />
              Clear Completed ({completedCount})
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* --- Confirmation Modal for Clear Completed (Animated) --- */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Clear completed?
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete {completedCount} completed{' '}
                {completedCount === 1 ? 'todo' : 'todos'}. This action cannot be
                undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={clearCompleted}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-colors font-medium shadow-lg"
                >
                  Yes, clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Todo List with beautiful cards and enter/exit animations --- */}
      <motion.div
        layout
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
      >
        {filteredTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 text-center"
          >
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <FaClipboardList className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {search ? 'No matching todos' : 'All done! 🎉'}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {search
                ? 'Try adjusting your search or filter'
                : 'You have no todos left. Add a new one to get started.'}
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence initial={false}>
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: -100,
                    transition: { duration: 0.2 },
                  }}
                  className={`p-5 hover:bg-white/60 transition-all duration-200 ${
                    deletingId === todo._id ? 'opacity-50 bg-red-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Animated Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTodoStatus(todo._id, todo.completed)}
                      className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-400 text-white shadow-md'
                          : 'border-gray-300 hover:border-blue-500 bg-white'
                      }`}
                    >
                      {todo.completed && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-white text-sm"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === todo._id ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200/50 transition-all"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                updateTodo(todo._id, { title: editTitle })
                              }
                              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md"
                            >
                              Save
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={cancelEditing}
                              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3
                            className={`text-lg font-semibold cursor-pointer ${
                              todo.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-800'
                            }`}
                            onClick={() => startEditing(todo)}
                          >
                            {todo.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                                todo.completed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {todo.completed ? (
                                <FaCheckCircle className="w-3 h-3" />
                              ) : (
                                <FaClock className="w-3 h-3" />
                              )}
                              {todo.completed ? 'Completed' : 'Pending'}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {new Date(todo.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons with animations */}
                    {editingId !== todo._id && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(todo)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <FaTrashAlt className="w-5 h-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- Footer stats with modern design --- */}
        {filteredTodos.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 backdrop-blur-sm border-t border-gray-200/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
              <p className="text-gray-600 flex items-center gap-2">
                <FaClipboardCheck className="text-blue-500" />
                Showing {filteredTodos.length} of {todos.length} todos
                {search && (
                  <span className="text-blue-600 font-medium"> • Filtered</span>
                )}
              </p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  Completed: {completedCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                  Pending: {pendingCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* --- Signature footer with heart --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-gray-500 text-sm"
      >
        <p className="flex items-center justify-center gap-2">
          Made with
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-red-500 inline-block"
          >
            ❤️
          </motion.span>
          by Muhammad Umar • {new Date().getFullYear()} Todo App
        </p>
      </motion.div>
    </div>
  )
}
