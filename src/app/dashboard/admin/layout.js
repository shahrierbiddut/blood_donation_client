"use client";

import AdminSidebar from "@/Components/Admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

<style jsx global>
  {`
    body {
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f9fafb;
      color: #374151;
    }
    .bg-gradient-to-b {
      background-image: linear-gradient(to bottom, #f7f7f7, #f1f1f1);
    }
    .text-gray-600 {
      color: #718096;
    }
    .text-gray-900 {
      color: #1a202c;
    }
  `}
</style>
