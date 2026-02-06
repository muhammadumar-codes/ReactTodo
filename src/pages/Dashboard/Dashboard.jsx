import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://todo-backend-steel-one.vercel.app/api'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  // 🔒 Protect dashboard
  if (!token) {
    return <div className="text-white text-xl">🚫 Access denied. Please login first.</div>
  }

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers(res.data.users)
      setLoading(false)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch users')
      setLoading(false)
    }
  }

  // Delete user
  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return

    try {
      await axios.delete(`${API}/auth/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchUsers() // refresh list
    } catch (err) {
      alert('Delete failed')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return <p className="text-white">Loading users...</p>
  }

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Registered users</p>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-900/80 border border-slate-700 rounded-xl text-white">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-800">
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
