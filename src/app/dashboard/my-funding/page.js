"use client";

import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";

function FundingContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">My Funding</h1>
          <p className="mt-2 text-sm text-slate-500">Funding module is ready for your next phase integration.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MyFundingPage() {
  return (
    <ProtectedRoute>
      <FundingContent />
    </ProtectedRoute>
  );
}
