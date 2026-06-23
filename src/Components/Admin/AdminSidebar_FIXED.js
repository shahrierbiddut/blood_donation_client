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
  FiPhone
} from "react-icons/fi";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Admin Rahim",
    email: user?.email || "admin@gmail.com",
    phone: user?.phone || "01700000000"
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileUpdate = () => {
    // In real app, this would call an API
    console.log("Profile updated:", profileData);
    setShowProfileEdit(false);
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: FiHome },
    { path: "/dashboard/admin/all-users", label: "All Users", icon: FiUsers },
    { path: "/dashboard/admin/all-blood-donation-request", label: "All Blood Donation Requests", icon: FiDroplet },
    { path: "/dashboard/admin/manage-volunteers", label: "Manage Volunteers", icon: FiHeart },
    { path: "/dashboard/admin/manage-admins", label: "Manage Admins", icon: FiShield },
    { path: "/dashboard/admin/all-donations", label: "All Donations", icon: FiGift },
    { path: "/dashboard/admin/payments", label: "Payments", icon: FiCreditCard },
    { path: "/dashboard/admin/reports", label: "Reports", icon: FiFileText },
    { path: "/dashboard/admin/settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 hidden md:flex flex-col h-screen sticky top-0 text-white shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">
              🩸
            </div>
            <div>
              <h1 className="text-lg font-black">BLOOD DONATION</h1>
              <p className="text-xs text-red-400 font-semibold">APPLICATION</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
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

        {/* Help Section */}
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

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name || "Admin Rahim"}</p>
                <p className="text-xs text-red-400 font-semibold">Super Admin</p>
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

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Profile Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {profileData.name.charAt(0)}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Role Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> <span className="text-purple-600 font-semibold">Super Admin</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowProfileEdit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
