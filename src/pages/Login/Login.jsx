import { useState } from "react";
import Button from "../../components/Button/button";


export default function Login() {

const [formData,setFormData]=useState({
  email:"",
  password:""
})


const handleChange=(e)=>{
  const {name,value}=e.target
  setFormData((prev)=>(
    console.log("prev",prev),
    {
    ...prev,
    [name]:value

  }))


}

const handleSubmit=(e)=>{
  e.preventDefault()
  console.log(formData)

}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-slate-700">
          <h1 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide">
            Login
          </h1>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <input
              onChange={handleChange}
              name="email"
              value={formData.email}
                type="email"
                placeholder="Email"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-slate-500 peer-placeholder-shown:text-base transition-all">
                Email
              </label>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all peer-focus:w-full"></span>
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <input
              onChange={handleChange}
              name="password"
              value={formData.password}
                type="password"
                placeholder="Password"
                className="peer w-full bg-transparent border-b-2 border-slate-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all"
              />
              <label className="absolute left-0 -top-1 text-slate-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-slate-500 peer-placeholder-shown:text-base transition-all">
                Password
              </label>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all peer-focus:w-full"></span>
            </div>
            
            {/* Sign In Button */}

            <Button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer">
              Sign In
            </Button>
           
            
            {/* Signup Link */}
            <p className="text-center text-slate-300 text-sm mt-4">
              Need an account?{' '}
              <a href="/register" className="text-pink-400 hover:text-pink-300 font-medium">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
