"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiDroplet,
  FiHeart,
  FiList,
  FiFileText,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: FiHome },
    { path: "/admin/all-users", label: "All Users", icon: FiUsers },
    { path: "/admin/all-blood-donation-request", label: "Blood Requests", icon: FiDroplet },
    { path: "/admin/manage-volunteers", label: "Manage Volunteers", icon: FiHeart },
    { path: "/admin/funding", label: "Funding Management", icon: FiList },
    { path: "/admin/content", label: "Content Management", icon: FiFileText },
    { path: "/admin/reports", label: "Reports & Analytics", icon: FiFileText },
    { path: "/admin/settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-red-600">BloodBank</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
