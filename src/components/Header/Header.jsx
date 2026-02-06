export default function Header() {
  // Current date
  const now = new Date();


  // Current user (static for now)
  const currentUser = "Umar Jani";

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-950 via-purple-900 to-fuchsia-900 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center">
      
      {/* Welcome message */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-300 mt-1">
          Welcome back, {currentUser} 👋
        </p>
      </div>

      {/* Current date */}
      <div className="mt-4 md:mt-0 text-white text-sm md:text-base text-right">
        <p>{now}</p>
      </div>

    </div>
  );
}
