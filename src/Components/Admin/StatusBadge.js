"use client";

export default function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    inprogress: 'bg-amber-100 text-amber-700',
    done: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    active: 'bg-emerald-100 text-emerald-700',
    blocked: 'bg-red-100 text-red-700'
  };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}
