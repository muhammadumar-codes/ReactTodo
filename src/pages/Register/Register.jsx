import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://todo-backend-api-livid.vercel.app/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      await axios.post(`${API}/auth/register`, {
        name,
        email,
        password
      })

      alert('Registered successfully')
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleRegister} className="bg-white p-6 w-80 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          className="w-full p-2 border mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}
