import { useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button/button'
import { useNavigate } from 'react-router-dom'

// API URL
const API_URL = 'https://todo-backend-api-livid.vercel.app/api/auth/register'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 💫 Handle avatar file & preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(null)
    }
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

      const data = new FormData()
      data.append('name', formData.fullName)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('confirmPassword', formData.confirmPassword)
      if (avatar) data.append('avatar', avatar)

      const res = await axios.post(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))

      showMessage('User registered successfully', 'success')

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      setAvatar(null)
      setAvatarPreview(null)

      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      showMessage(
        error.response?.data?.message || 'Registration failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

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
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-slate-700 relative overflow-hidden">
          <div className="flex justify-center -mt-16 mb-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-500 shadow-xl">
                ?
              </div>
            )}
          </div>

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

            {/* Avatar Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-white"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Upload Avatar
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
