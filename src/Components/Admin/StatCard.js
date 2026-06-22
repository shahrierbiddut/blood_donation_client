"use client";

export default function StatCard({ title, value, icon, delta }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-900/10 text-4xl">{icon ? String.fromCharCode(9830) : null}</div>
        <div className="text-red-600 text-3xl p-2 bg-red-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      </div>
      {delta ? <div className="mt-4 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">{delta}</div> : null}
    </div>
  );
}
