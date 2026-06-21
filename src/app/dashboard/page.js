// src/app/dashboard/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiDroplet,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiHome,
  FiList,
  FiSearch,
  FiDollarSign,
  FiUser,
  FiSettings
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";

const STATUS_STYLE = {
  pending:    "bg-slate-100 text-slate-600",
  inprogress: "bg-orange-100 text-orange-700",
  done:       "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-600",
};
const STATUS_LABEL = {
  pending:    "Pending",
  inprogress: "In Progress",
  done:       "Done",
  cancelled:  "Cancelled",
};

const STAT_CARDS = [
  { key: "total",      label: "My Requests",  icon: FiDroplet,      iconBg: "bg-red-50",     iconColor: "text-red-500",     valColor: "text-slate-900" },
  { key: "inprogress", label: "In Progress",  icon: FiClock,        iconBg: "bg-amber-50",   iconColor: "text-amber-500",   valColor: "text-amber-600" },
  { key: "done",       label: "Completed",    icon: FiCheckCircle,  iconBg: "bg-emerald-50", iconColor: "text-emerald-500", valColor: "text-emerald-600" },
  { key: "cancelled",  label: "Cancelled",    icon: FiXCircle,      iconBg: "bg-red-50",     iconColor: "text-red-400",     valColor: "text-red-500" },
];

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, inprogress: 0, done: 0, cancelled: 0 });
  const [recentRequests, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const name = user?.name || user?.email?.split("@")[0] || "User";
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Donor";
  const sidebarItems = useMemo(
    () => [
      { href: "/dashboard", icon: FiHome, label: "Dashboard" },
      { href: "/dashboard/my-requests", icon: FiList, label: "My Requests" },
      { href: "/search-donors", icon: FiSearch, label: "Search Donors" },
      { href: "/dashboard/my-funding", icon: FiDollarSign, label: "My Funding" },
      { href: "/dashboard/profile", icon: FiUser, label: "Profile" },
      { href: "/dashboard/settings", icon: FiSettings, label: "Settings" },
      { href: "/dashboard/create-request", icon: FiPlusCircle, label: "Create Request" }
    ],
    []
  );

  const toStats = (items) => ({
    total: items.length,
    inprogress: items.filter((r) => r.status === "inprogress").length,
    done: items.filter((r) => r.status === "done").length,
    cancelled: items.filter((r) => r.status === "cancelled").length
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await donationService.getStats();
        if (res.success && res.data?.recentRequests?.length) {
          setStats(res.data.stats);
          setRecent(res.data.recentRequests);
        } else {
          setRecent(mockDonationRequests.slice(0, 10));
          setStats(toStats(mockDonationRequests));
        }
      } catch {
        setRecent(mockDonationRequests.slice(0, 10));
        setStats(toStats(mockDonationRequests));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donation request?")) return;
    try {
      setDeleteId(id);
      await donationService.remove(id);
      setRecent((p) => p.filter((r) => r._id !== id));
      setStats((p) => ({ ...p, total: p.total - 1 }));
    } catch { alert("Delete failed. Please try again."); }
    finally { setDeleteId(null); }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—");

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Sidebar ─── */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="bg-linear-to-b from-red-600 to-red-500 px-4 py-5 text-center text-white">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={name}
                  width={72}
                  height={72}
                  className="mx-auto mb-2 h-18 w-18 rounded-full object-cover ring-2 ring-white/50"
                  unoptimized
                />
              ) : (
                <div className="mx-auto mb-2 flex h-18 w-18 items-center justify-center rounded-full bg-white/20 text-2xl font-black text-white ring-2 ring-white/40">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="truncate text-sm font-bold">{name}</p>
              <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold capitalize">
                {role}
              </span>
            </div>

            <nav className="p-3">
              {sidebarItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Icon className="text-base" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, <strong className="text-slate-700">{name}</strong> — thank you for being a lifesaver!</p>
            </div>
            <Link
              href="/dashboard/create-request"
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md"
            >
              <FiPlusCircle /> Create Request
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STAT_CARDS.map(({ key, label, icon: Icon, iconBg, iconColor, valColor }) => (
              <div key={key} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`text-lg ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-3xl font-black ${valColor}`}>{loading ? "—" : stats[key]}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Requests Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Recent Donation Requests</h2>
              <Link
                href="/donation-requests"
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400">
                <span className="animate-pulse">Loading...</span>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="py-16 text-center">
                <FiDroplet className="mx-auto mb-3 text-5xl text-red-100" />
                <p className="font-semibold text-slate-400">No donation requests yet</p>
                <Link
                  href="/dashboard/create-request"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  <FiPlusCircle /> Create your first request
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3 text-left">Recipient Name</th>
                      <th className="px-5 py-3 text-left">Location</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Time</th>
                      <th className="px-5 py-3 text-left">Blood</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Donor</th>
                      <th className="px-5 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="transition hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-semibold text-slate-900">{req.recipientName}</td>
                        <td className="px-5 py-4 text-slate-500">
                          {req.district}{req.upazila ? `, ${req.upazila}` : ""}
                        </td>
                        <td className="px-5 py-4 text-slate-500">{fmtDate(req.donationDate)}</td>
                        <td className="px-5 py-4 text-slate-500">{req.donationTime}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[req.status] || STATUS_STYLE.pending}`}>
                            {STATUS_LABEL[req.status] || req.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {req.donor ? (
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{req.donor.name}</p>
                              <p className="text-[11px] text-slate-400">{req.donor.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/donation-requests/${req._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-blue-200 hover:text-blue-500"
                              title="View"
                            >
                              <FiEye className="text-sm" />
                            </Link>
                            <Link
                              href={`/dashboard/edit-request/${req._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-amber-200 hover:text-amber-500"
                              title="Edit"
                            >
                              <FiEdit2 className="text-sm" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(req._id)}
                              disabled={deleteId === req._id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                              title="Delete"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
