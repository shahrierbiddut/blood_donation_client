"use client";

import AdminSidebar from "@/Components/Admin/AdminSidebar";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
