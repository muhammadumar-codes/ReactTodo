import { useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button/button'
import { useNavigate } from 'react-router-dom'

// API URL
const API_URL = 'https://todo-backend-api-livid.vercel.app/api/auth/register'

// REGISTER FORM
export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match', 'error')
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(API_URL, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      localStorage.setItem('token', res.data.token)

      showMessage('User registered successfully ', 'success')

      // Reset form

      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      // Redirect after animation
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      showMessage(
        error.response?.data?.message || 'Registration failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  // 💎 Show Animated Message
  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-slate-700 relative overflow-hidden">
          <h1 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide">
            Register
          </h1>

          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-500 transform animate-slideIn
              ${
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                required
                placeholder="Full Name"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="Email"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                placeholder="Password"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                required
                placeholder="Confirm Password"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Confirm Password
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>

            <p className="text-center text-slate-300 text-sm mt-4">
              Already have an account?{' '}
              <a href="/" className="text-blue-400 hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* 💫 Slide Animation */}
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.4s ease forwards;
          }
        `}
      </style>
    </div>
  )
}
