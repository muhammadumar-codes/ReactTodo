import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://todo-backend-api-livid.vercel.app/api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const token = localStorage.getItem('token')
  console.log(token);
  


  /* ===================== AUTH CHECK ===================== */
  useEffect(() => {
    if (!token) {
      alert('Access denied. Please login.')
      window.location.href = '/login'
      return
    }

    fetchUser()
    fetchTodos()
  }, [])

  /* ===================== FETCH USER ===================== */
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data.user)
    } catch (err) {
      logout()
    }
  }

  /* ===================== FETCH TODOS ===================== */
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(res.data.todos)
      setLoading(false)
    } catch (err) {
      alert('Failed to load todos')
      setLoading(false)
    }
  }

  /* ===================== ADD / UPDATE TODO ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      if (editingId) {
        const res = await axios.put(
          `${API}/todos/${editingId}`,
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setTodos((prev) =>
          prev.map((t) => (t._id === editingId ? res.data.todo : t))
        )

        setEditingId(null)
      } else {
        const res = await axios.post(
          `${API}/todos`,
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setTodos((prev) => [res.data.todo, ...prev])
      }

      setTitle('')
    } catch (err) {
      alert('Action failed')
    }
  }

  /* ===================== TOGGLE COMPLETE ===================== */
  const toggleComplete = async (todo) => {
    try {
      const res = await axios.put(
        `${API}/todos/${todo._id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? res.data.todo : t))
      )
    } catch {
      alert('Update failed')
    }
  }

  /* ===================== DELETE TODO ===================== */
  const deleteTodo = async (id) => {
    if (!confirm('Delete this todo?')) return

    try {
      await axios.delete(`${API}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch {
      alert('Delete failed')
    }
  }

  /* ===================== LOGOUT ===================== */
  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* ADD TODO */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Enter todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 border rounded"
        />
        <button className="px-5 py-3 bg-blue-600 text-white rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      {/* TODO LIST */}
      <div className="bg-white rounded shadow">
        {todos.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No todos yet
          </p>
        )}

        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex justify-between items-center p-4 border-b"
          >
            <div
              onClick={() => toggleComplete(todo)}
              className={`cursor-pointer ${
                todo.completed
                  ? 'line-through text-gray-400'
                  : ''
              }`}
            >
              {todo.title}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingId(todo._id)
                  setTitle(todo.title)
                }}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
