import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Load token
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    setToken(savedToken)
  }, [])

  // Auth check + fetch todos
  useEffect(() => {
    if (token === null) return

    if (!token) {
      navigate('/')
      return
    }

    fetchTodos()
  }, [token])

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(res.data.todos)
      setLoading(false)
      setError('')
    } catch (err) {
      setError('Failed to fetch todos. Please try again.')
      logout()
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please enter a todo title')
      return
    }

    try {
      const res = await axios.post(
        `${API}/todos`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setTodos([res.data.todo, ...todos])
      setTitle('')
      setSuccess('Todo added successfully!')
      setError('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to add todo. Please try again.')
    }
  }

  const updateTodo = async (id, updates) => {
    try {
      const res = await axios.put(`${API}/todos/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setTodos(todos.map((todo) => (todo._id === id ? res.data.todo : todo)))
      setEditingId(null)
      setEditTitle('')
      setSuccess('Todo updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update todo.')
    }
  }

  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return

    try {
      await axios.delete(`${API}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setTodos(todos.filter((todo) => todo._id !== id))
      setSuccess('Todo deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete todo.')
    }
  }

  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `${API}/todos/${id}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setTodos(todos.map((todo) => (todo._id === id ? res.data.todo : todo)))
      setSuccess(`Todo marked as ${!currentStatus ? 'completed' : 'pending'}!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update todo status.')
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    // Apply filter
    if (filter === 'completed' && !todo.completed) return false
    if (filter === 'pending' && todo.completed) return false

    // Apply search
    if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) {
      return false
    }

    return true
  })

  // Stats
  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.filter((todo) => !todo.completed).length

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your todos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Todo Dashboard</h1>
            <p className="text-gray-600 mt-1">Stay organized and productive</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back!</p>
              <p className="font-medium text-gray-800">{todos.length} todos</p>
            </div>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Todos</p>
                <p className="text-2xl font-bold text-gray-800">{todos.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError('')
                }}
                placeholder="What needs to be done? (e.g., 'Buy groceries', 'Finish report')"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              + Add Todo
            </button>
          </div>
        </form>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search todos..."
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-red-600">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-green-600">✅</span>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Todos List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredTodos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {search ? 'No todos found' : 'No todos yet'}
            </h3>
            <p className="text-gray-500">
              {search
                ? 'Try adjusting your search terms'
                : 'Add your first todo using the form above!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className={`p-6 hover:bg-gray-50 transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodoStatus(todo._id, todo.completed)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && <span className="text-white text-sm">✓</span>}
                  </button>

                  {/* Todo Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTodo(todo._id, { title: editTitle })}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3
                          className={`text-lg font-medium ${
                            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}
                          onClick={() => startEditing(todo)}
                        >
                          {todo.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              todo.completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {todo.completed ? 'Completed' : 'Pending'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {editingId !== todo._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {filteredTodos.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
              <p>
                Showing {filteredTodos.length} of {todos.length} todos
                {search && ` • Searching: "${search}"`}
              </p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Completed: {completedCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Pending: {pendingCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Muhammad Umar ❤️ • {new Date().getFullYear()} Todo App</p>
      </div>
    </div>
  )
}
