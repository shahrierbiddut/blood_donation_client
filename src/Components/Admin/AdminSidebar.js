"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiDroplet,
  FiHeart,
  FiShield,
  FiGift,
  FiCreditCard,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiX,
  FiPhone,
  FiCamera,
  FiMail
} from "react-icons/fi";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Admin Rahim",
    email: user?.email || "admin@gmail.com",
    phone: user?.phone || "01700000000",
    role: user?.role || "Super Admin",
    address: user?.address || "Dhanmondi, Dhaka",
    avatar: user?.avatar || "https://i.pravatar.cc/120?img=12"
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileUpdate = () => {
    setShowProfileEdit(false);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: FiHome },
    { path: "/admin/all-users", label: "All Users", icon: FiUsers },
    { path: "/admin/all-blood-donation-request", label: "All Blood Donation Requests", icon: FiDroplet },
    { path: "/admin/manage-volunteers", label: "Manage Volunteers", icon: FiHeart },
    { path: "/admin/manage-admins", label: "Manage Admins", icon: FiShield },
    { path: "/admin/all-donations", label: "All Donations", icon: FiGift },
    { path: "/admin/payments", label: "Payments", icon: FiCreditCard },
    { path: "/admin/reports", label: "Reports", icon: FiFileText },
    { path: "/admin/settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <>
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 hidden md:flex flex-col h-screen sticky top-0 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">🩸</div>
            <div>
              <h1 className="text-lg font-black">BLOOD DONATION</h1>
              <p className="text-xs text-red-400 font-semibold">APPLICATION</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FiPhone size={16} className="text-red-400" />
              <p className="text-sm font-semibold">Need Help?</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">Contact Support for assistance</p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Contact Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-red-400/60 shadow-lg"
                style={{ backgroundImage: `url(${profileData.avatar})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profileData.name}</p>
                <p className="text-xs text-red-400 font-semibold">{profileData.role}</p>
              </div>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                title="Edit Profile"
              >
                <FiEdit2 size={14} className="text-slate-300" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium justify-center"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="relative bg-gradient-to-r from-red-950 to-red-700 px-6 py-7 text-white">
              <button
                onClick={() => setShowProfileEdit(false)}
                className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-xl"
                    style={{ backgroundImage: `url(${profileData.avatar})` }}
                  />
                  <label className="absolute bottom-1 right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-red-600 text-white shadow-lg ring-2 ring-white hover:bg-red-700">
                    <FiCamera size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-red-100">Admin Profile</p>
                  <h2 className="text-2xl font-black">{profileData.name}</h2>
                  <p className="mt-1 text-sm text-red-100">{profileData.role}</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}
              className="p-6"
            >
              <div className="mb-5 grid gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700"><FiMail className="text-red-500" /> {profileData.email}</p>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700"><FiPhone className="text-red-500" /> {profileData.phone}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              </div>

              <div className="mt-6 flex gap-4 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
