import { useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button/button'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/input/input'

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    // Optional size check (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image must be less than 2MB', 'error')
      return
    }

    setAvatar(file)

    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
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

      if (avatar) {
        data.append('avatar', avatar)
      }

      const res = await axios.post(API_URL, data)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))

      showMessage('User registered successfully', 'success')

      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.log(error.response?.data)
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
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-3xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.7)] border border-slate-700 relative overflow-hidden transition-transform hover:scale-[1.01]">
          {/* Avatar */}
          <div className="flex justify-center -mt-20 mb-6">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-600 shadow-2xl">
                ?
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-white text-center mb-6">
            Create Account
          </h1>

          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />

            {/* Avatar Upload */}
            <label className="w-full flex flex-col items-center justify-center p-3 bg-slate-800/40 rounded-xl border border-slate-600 cursor-pointer hover:bg-slate-700 transition">
              <span className="text-slate-300 text-sm mb-1">
                {avatar ? avatar.name : 'Upload Avatar (Optional)'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl"
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
