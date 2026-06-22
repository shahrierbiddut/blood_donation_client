"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiClock, FiDroplet, FiMapPin, FiMoreHorizontal, FiPhone, FiXCircle } from "react-icons/fi";

const statusMeta = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 ring-amber-100",
    icon: FiClock
  },
  inprogress: {
    label: "In Progress",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    icon: FiClock
  },
  done: {
    label: "Completed",
    badge: "bg-blue-50 text-blue-700 ring-blue-100",
    icon: FiCheckCircle
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 ring-red-100",
    icon: FiXCircle
  }
};

const formatDate = (value) => {
  if (!value) return "Not provided";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function RequestTableRow({ item, index, onStatusChange, updating }) {
  const meta = statusMeta[item.status] || statusMeta.pending;
  const location = [item.upazila, item.district].filter(Boolean).join(", ");

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition">
      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{index}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-base font-black text-red-600 flex-shrink-0">
            {item.bloodGroup}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{item.recipientName}</p>
            <p className="text-xs text-slate-500 truncate">Posted by you</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <p className="font-bold text-slate-900">{location || "Not specified"}</p>
          <p className="text-xs text-slate-500 mt-0.5">{item.hospitalName || "Hospital not specified"}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <p className="font-bold text-slate-900">{item.bloodGroup}</p>
          <p className="text-xs text-slate-500 mt-0.5">{formatDate(item.donationDate)}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ring-1 ${meta.badge}`}>
          {meta.label}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {item.status === "inprogress" ? (
            <>
              <button 
                onClick={() => onStatusChange(item._id, "done")} 
                disabled={updating} 
                className="px-3 py-1.5 text-xs font-black bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-300 transition"
              >
                Done
              </button>
              <button 
                onClick={() => onStatusChange(item._id, "cancelled")} 
                disabled={updating} 
                className="px-3 py-1.5 text-xs font-black text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:text-slate-300 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <Link 
              href={`/donation-requests/${item._id}`} 
              className="px-3 py-1.5 text-xs font-black text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition inline-block"
            >
              View
            </Link>
          )}
          <Link 
            href={`/donation-requests/${item._id}`} 
            className="p-1.5 text-slate-500 hover:text-red-600 transition"
            aria-label="More options"
          >
            <FiMoreHorizontal size={18} />
          </Link>
        </div>
      </td>
    </tr>
  );
}

function MyRequestsContent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [notice, setNotice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const response = await donationService.getMy();
        setRequests(response?.success ? response.data || [] : mockDonationRequests.slice(0, 20));
      } catch {
        setRequests(mockDonationRequests.slice(0, 20));
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setNotice("");
    const previous = requests;
    setRequests((items) => items.map((item) => (item._id === id ? { ...item, status } : item)));

    try {
      if (!String(id).startsWith("mock-")) {
        const response = await donationService.update(id, { status });
        if (response?.success && response.data) {
          setRequests((items) => items.map((item) => (item._id === id ? { ...item, ...response.data } : item)));
        }
      }
      setNotice(status === "done" ? "Request marked as completed." : "Request cancelled.");
    } catch (error) {
      setRequests(previous);
      setNotice(error.message || "Could not update this request.");
    } finally {
      setUpdatingId("");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My <span className="text-red-600">Requests</span></h1>
            <p className="text-sm text-slate-500">Track donor progress and manage your blood requests.</p>
          </div>
          <Link href="/dashboard/create-request" className="w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
            Create Request
          </Link>
        </div>

        {notice ? <div className="mb-5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">{notice}</div> : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center font-semibold text-slate-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-white py-20 text-center">
            <FiDroplet className="mx-auto mb-3 text-5xl text-red-200" />
            <p className="font-semibold text-slate-500">You have not created any requests yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">#</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Recipient Info</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">Blood Group</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((item, idx) => (
                    <RequestTableRow
                      key={item._id}
                      item={item}
                      index={startIndex + idx + 1}
                      onStatusChange={handleStatusChange}
                      updating={updatingId === item._id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <div className="text-sm font-semibold text-slate-600">
                Showing <span className="font-black text-slate-900">{startIndex + 1}</span> to <span className="font-black text-slate-900">{Math.min(startIndex + itemsPerPage, requests.length)}</span> of <span className="font-black text-slate-900">{requests.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition"
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg font-black text-sm transition ${
                        currentPage === page
                          ? "bg-red-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition"
                  aria-label="Next page"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
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
