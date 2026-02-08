import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button/button'

const API = 'https://todo-backend-api-livid.vercel.app/api'

export default function TodoDashboard() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [updatingId, setUpdatingId] = useState(null)
  const [updateData, setUpdateData] = useState({ title: '', description: '' })

  const token = localStorage.getItem('token')

  // Protect route
  useEffect(() => {
    if (!token) {
      alert('🚫 Access denied. Please login first.')
      window.location.href = '/login'
      return
    }
    fetchTodos()
  }, [token])

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(res.data.todos)
      setLoading(false)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch todos')
      setLoading(false)
    }
  }

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.title) return alert('Title is required!')

    try {
      const res = await axios.post(`${API}/todos`, newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos([res.data.todo, ...todos])
      setNewTodo({ title: '', description: '' })
    } catch (err) {
      alert('Failed to add todo')
    }
  }

  // Delete todo
  const deleteTodo = async (id) => {
    if (!confirm('Delete this todo?')) return
    try {
      await axios.delete(`${API}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  // Start updating a todo
  const startUpdate = (todo) => {
    setUpdatingId(todo._id)
    setUpdateData({ title: todo.title, description: todo.description })
  }

  // Cancel updating
  const cancelUpdate = () => {
    setUpdatingId(null)
    setUpdateData({ title: '', description: '' })
  }

  // Submit update
  const submitUpdate = async (id) => {
    if (!updateData.title) return alert('Title is required!')
    try {
      const res = await axios.put(`${API}/todos/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTodos(todos.map((t) => (t._id === id ? res.data.todo : t)))
      cancelUpdate()
    } catch (err) {
      alert('Failed to update')
    }
  }

  if (loading) {
    return (
      <p className="text-white text-xl flex justify-center items-center h-screen">
        Loading todos...
      </p>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-900">
      <h1 className="text-3xl font-bold text-white mb-4">My Todos</h1>

      {/* Add Todo Form */}
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="flex-1 p-2 rounded-md border border-slate-600 bg-slate-800 text-white focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          className="flex-1 p-2 rounded-md border border-slate-600 bg-slate-800 text-white focus:outline-none focus:border-blue-400"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
          Add Todo
        </Button>
      </form>

      {/* Todos List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 text-white rounded-xl border border-slate-700">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id} className="border-b border-slate-700 hover:bg-slate-700">
                <td className="px-6 py-3">
                  {updatingId === todo._id ? (
                    <input
                      type="text"
                      value={updateData.title}
                      onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                      className="p-1 rounded-md border border-slate-600 bg-slate-800 text-white focus:outline-none focus:border-blue-400 w-full"
                    />
                  ) : (
                    todo.title
                  )}
                </td>
                <td className="px-6 py-3">
                  {updatingId === todo._id ? (
                    <input
                      type="text"
                      value={updateData.description}
                      onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                      className="p-1 rounded-md border border-slate-600 bg-slate-800 text-white focus:outline-none focus:border-blue-400 w-full"
                    />
                  ) : (
                    todo.description
                  )}
                </td>
                <td className="px-6 py-3 flex gap-2 justify-center">
                  {updatingId === todo._id ? (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                        onClick={() => submitUpdate(todo._id)}
                      >
                        Save
                      </Button>
                      <Button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded" onClick={cancelUpdate}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                        onClick={() => startUpdate(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
