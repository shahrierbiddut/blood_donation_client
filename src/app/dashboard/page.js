// src/app/dashboard/page.js
"use client";

import ProtectedRoute from "@/Components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@heroui/react";
import Link from "next/link";

function DashboardContent() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-red-600">🩸 Blood Bank</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button 
                onClick={handleLogout}
                className="bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Role: <span className="font-semibold text-red-600 capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Blood Group</p>
            <p className="text-3xl font-bold text-red-600">{user?.bloodGroup}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Location</p>
            <p className="text-lg font-bold text-gray-900">{user?.district}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Total Donations</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Account Status</p>
            <p className="text-lg font-bold text-green-600 capitalize">{user?.status}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Navigation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/profile">
              <Button className="w-full bg-blue-600 text-white py-6">
                👤 View/Edit Profile
              </Button>
            </Link>

            {user?.role === "donor" && (
              <>
                <Link href="/donation-requests">
                  <Button className="w-full bg-red-600 text-white py-6">
                    🩸 Browse Requests
                  </Button>
                </Link>
                <Link href="/dashboard/my-requests">
                  <Button className="w-full bg-purple-600 text-white py-6">
                    📋 My Requests
                  </Button>
                </Link>
              </>
            )}

            {user?.role === "volunteer" && (
              <>
                <Link href="/dashboard/all-requests">
                  <Button className="w-full bg-orange-600 text-white py-6">
                    📋 All Requests
                  </Button>
                </Link>
                <Link href="/dashboard/activity-log">
                  <Button className="w-full bg-teal-600 text-white py-6">
                    📊 Activity Log
                  </Button>
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Link href="/dashboard/users">
                  <Button className="w-full bg-indigo-600 text-white py-6">
                    👥 User Management
                  </Button>
                </Link>
                <Link href="/dashboard/statistics">
                  <Button className="w-full bg-green-600 text-white py-6">
                    📊 Statistics
                  </Button>
                </Link>
                <Link href="/dashboard/funding">
                  <Button className="w-full bg-yellow-600 text-white py-6">
                    💰 Funding
                  </Button>
                </Link>
              </>
            )}

            <Link href="/">
              <Button className="w-full bg-gray-600 text-white py-6">
                🏠 Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-800">
          <p className="font-semibold mb-2">🚀 Phase 2 Implementation</p>
          <p>
            Dashboard pages are coming in the next phases. For now, you can explore the home page 
            and view your profile information above.
          </p>
        </div>
      </div>
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
