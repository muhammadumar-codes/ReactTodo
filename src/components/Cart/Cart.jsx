
export  default function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500 transition">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
    </div>
  );
}
