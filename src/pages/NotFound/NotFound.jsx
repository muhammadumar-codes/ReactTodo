import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="text-center bg-slate-900/80 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-slate-700 max-w-md w-full">
        
        {/* 404 Text */}
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-400 mb-8">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Go Home
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border border-slate-600 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
