"use client";

export default function StatCard({ title, value, icon, delta }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-500">{title}</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
        </div>
        <div className="text-red-600 text-3xl">{icon}</div>
      </div>
      {delta ? <div className="mt-3 text-sm text-slate-500">{delta}</div> : null}
    </div>
  );
}
