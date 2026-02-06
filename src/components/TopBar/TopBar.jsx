export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-slate-900/70 backdrop-blur border-b border-slate-700">
      <h2 className="text-white font-semibold">
        Welcome, <span className="text-blue-400">Umar</span>
      </h2>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-white font-medium">Umar Jani</p>
          <p className="text-xs text-slate-400">Admin</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
}
