import { useState } from 'react'
import axios from 'axios'
import Button from '../../components/Button/button'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        'https://todo-backend-api-livid.vercel.app/api/auth/register',
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      )

      localStorage.setItem('token', res.data.token)
      alert('Registered Successfully 🎉')

      // Reset form
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })

      // Redirect to login
      navigate('/')
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-slate-700">
          <h1 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide">
            Register
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
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
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
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
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
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
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Confirm Password"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm">
                Confirm Password
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl"
              >
                {loading ? 'Registering...' : 'Sign Up'}
              </Button>
            </div>

            <p className="text-center text-slate-300 text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
