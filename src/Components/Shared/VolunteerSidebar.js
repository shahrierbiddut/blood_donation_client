"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  FiHome,
  FiDroplet,
  FiUser,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiPhone,
  FiX,
  FiCamera
} from "react-icons/fi";

export default function VolunteerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Volunteer User",
    email: user?.email || "volunteer@gmail.com",
    phone: user?.phone || "01700000000",
    role: user?.role || "Volunteer",
    address: user?.address || "Dhaka",
    avatar: user?.avatar || "https://i.pravatar.cc/120?img=20"
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
    { path: "/dashboard/volunteer", label: "Dashboard", icon: FiHome },
    { path: "/dashboard/volunteer/all-requests", label: "All Blood Requests", icon: FiDroplet },
    { path: "/dashboard/volunteer/profile", label: "Profile", icon: FiUser },
    { path: "/dashboard/volunteer/settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <>
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 hidden md:flex flex-col h-screen sticky top-0 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">🩸</div>
            <div>
              <h1 className="text-lg font-black">BLOOD DONATION</h1>
              <p className="text-xs text-red-400 font-semibold">VOLUNTEER</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Volunteer Panel</p>
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
            <p className="text-xs text-slate-400 mb-3">Contact support team</p>
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
                <p className="text-xs text-red-400 font-semibold capitalize">{profileData.role}</p>
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
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
              <button onClick={() => setShowProfileEdit(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <label className="relative cursor-pointer group">
                  <div
                    className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-red-200 shadow-lg group-hover:ring-red-400 transition-all"
                    style={{ backgroundImage: `url(${profileData.avatar})` }}
                  />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all">
                    <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleProfileUpdate}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
