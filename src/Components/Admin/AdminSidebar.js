"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdminSidebar({ active = '/admin' }) {
  const items = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/all-users', label: 'All Users' },
    { href: '/admin/all-blood-donation-request', label: 'All Blood Donation Requests' },
    { href: '/admin/manage-volunteers', label: 'Manage Volunteers' },
    { href: '/admin/funding', label: 'Funding Management' },
    { href: '/admin/content', label: 'Content Management' },
    { href: '/admin/reports', label: 'Reports & Analytics' },
    { href: '/admin/settings', label: 'Settings' }
  ];

  return (
    <aside className="w-72 hidden md:block bg-white border-r border-slate-100 min-h-screen px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-red-600 flex items-center justify-center text-white font-bold">BD</div>
        <div>
          <div className="text-lg font-extrabold text-slate-900">Blood Donation</div>
          <div className="text-xs text-slate-500">Admin Panel</div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <Image src="/location/district.json" alt="avatar" width={40} height={40} className="rounded-full object-cover" />
          <div>
            <div className="font-semibold text-slate-800">Admin Rahim</div>
            <div className="text-xs text-slate-500">Super Admin</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className={`block rounded-md px-3 py-2 text-sm font-medium ${active === it.href ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-slate-50'}`}>
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
