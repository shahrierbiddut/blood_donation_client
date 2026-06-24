"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";
import { FiCalendar, FiClock, FiDroplet, FiEye, FiMapPin, FiPhone } from "react-icons/fi";

const formatDate = (value) => {
  if (!value) return "Not provided";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function InProgressCard({ item }) {
  const requester = item.requester || {};
  const location = [item.upazila, item.district].filter(Boolean).join(", ");

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
              <FiDroplet /> {item.bloodGroup}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase text-amber-700 ring-1 ring-amber-100">
              In Progress
            </span>
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-900">{item.recipientName}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Requested by {requester.name || "a registered member"}
          </p>
        </div>

        <Link
          href={`/donation-requests/${item._id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-black text-red-600 transition hover:bg-red-50"
        >
          <FiEye /> View
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400"><FiMapPin /> Location</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{location || "Not specified"}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400"><FiCalendar /> Date</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{formatDate(item.donationDate)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400"><FiClock /> Time</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{item.donationTime || "Not provided"}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400"><FiPhone /> Requester</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">{requester.phone || requester.email || "Not provided"}</p>
        </div>
      </div>

      {item.hospitalName ? (
        <p className="mt-4 text-sm font-semibold text-slate-600">Hospital: <span className="text-slate-900">{item.hospitalName}</span></p>
      ) : null}
    </article>
  );
}

function InProgressContent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await donationService.getMyInProgress();
        const mockRequests = mockDonationRequests
          .filter((item) => donationService.getAcceptedMockIds().includes(item._id))
          .map((item) => ({ ...item, status: "inprogress" }));
        setRequests(response?.success ? [...(response.data || []), ...mockRequests] : mockRequests);
      } catch (err) {
        const mockRequests = mockDonationRequests
          .filter((item) => donationService.getAcceptedMockIds().includes(item._id))
          .map((item) => ({ ...item, status: "inprogress" }));
        setRequests(mockRequests);
        setError(err?.message || "Could not load your in-progress donations.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">In <span className="text-red-600">Progress</span></h1>
            <p className="text-sm text-slate-500">Donation requests you accepted are tracked here.</p>
          </div>
          <Link href="/donation-requests" className="w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
            Find Requests
          </Link>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center font-semibold text-slate-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-white py-20 text-center">
            <FiDroplet className="mx-auto mb-3 text-5xl text-red-200" />
            <p className="font-semibold text-slate-500">No in-progress donations found.</p>
            <p className="mt-1 text-sm text-slate-400">Accepted requests will appear here after you tap Donate.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((item) => (
              <InProgressCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function InProgressPage() {
  return (
    <ProtectedRoute>
      <InProgressContent />
    </ProtectedRoute>
  );
}
