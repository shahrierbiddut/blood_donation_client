"use client";

import Link from "next/link";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import mockDonationRequests from "@/data/mockDonationRequests";

function MyRequestsContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h1 className="text-xl font-black text-slate-900">My Requests</h1>
          </div>
          <div className="overflow-x-auto px-2 py-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-400">
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Blood</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockDonationRequests.slice(0, 10).map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.recipientName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.district}, {item.upazila}</td>
                    <td className="px-4 py-3">{item.bloodGroup}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{item.status}</td>
                    <td className="px-4 py-3">
                      <Link href={`/donation-requests/${item._id}`} className="text-red-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MyRequestsPage() {
  return (
    <ProtectedRoute>
      <MyRequestsContent />
    </ProtectedRoute>
  );
}
