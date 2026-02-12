import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-center px-6 overflow-hidden">
      {/* Background Glow Blurs */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-20 -right-20"></div>

      {/* 404 Text */}
      <h1 className="text-9xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
        404
      </h1>

      {/* Title */}
      <h2 className="mt-6 text-3xl md:text-4xl font-bold text-white">
        Page not found
      </h2>

      {/* Description */}
      <p className="mt-4 text-slate-400 max-w-md leading-relaxed">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        removed or the URL is incorrect.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform duration-300"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
