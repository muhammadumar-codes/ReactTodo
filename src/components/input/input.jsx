function Input({ name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full bg-transparent border-b-2 border-slate-600 py-2 text-white focus:outline-none focus:border-blue-400 transition"
      />
    </div>
  )
}
export default Input
