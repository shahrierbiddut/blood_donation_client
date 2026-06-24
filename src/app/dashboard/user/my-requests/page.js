"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiClock, FiDroplet, FiMoreHorizontal, FiXCircle, FiEdit, FiEye } from "react-icons/fi";

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
  const [openMenu, setOpenMenu] = useState(false);

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
        <div className="relative flex items-center justify-center gap-2">
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
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="p-1.5 text-slate-500 hover:text-red-600 transition"
              aria-label="More options"
            >
              <FiMoreHorizontal size={18} />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <Link
                  href={`/donation-requests/${item._id}`}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-b border-slate-100"
                >
                  <FiEye size={16} />
                  View Details
                </Link>
                <Link
                  href={`/dashboard/edit-request/${item._id}`}
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                >
                  <FiEdit size={16} />
                  Edit Request
                </Link>
              </div>
            )}
          </div>
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenStatusDropdown(false);
      }
    };

    if (openStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openStatusDropdown]);

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

  // Filter requests based on status
  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(req => req.status === statusFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

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

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My <span className="text-red-600">Donation Requests</span></h1>
            <p className="text-sm text-slate-500">Manage and track your blood donation posts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/user/in-progress" className="w-fit rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-black text-amber-700 transition hover:bg-amber-100">
              In Progress
            </Link>
            <Link href="/dashboard/user/create-request" className="w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700">
              Create Request
            </Link>
          </div>
        </div>

        {/* Status Filter Dropdown */}
        <div ref={dropdownRef} className="mb-6 relative inline-block w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-red-300 transition"
            >
              <span>{statusFilter === "all" ? "All Status" : statusMeta[statusFilter]?.label}</span>
              <svg className={`w-4 h-4 transition-transform ${openStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
            {openStatusDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    handleStatusFilterChange("all");
                    setOpenStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-slate-100 hover:bg-slate-50 transition ${
                    statusFilter === "all" ? "text-red-600 bg-red-50" : "text-slate-700"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => {
                    handleStatusFilterChange("pending");
                    setOpenStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-slate-100 hover:bg-amber-50 transition ${
                    statusFilter === "pending" ? "text-amber-600 bg-amber-50" : "text-slate-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    handleStatusFilterChange("inprogress");
                    setOpenStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-slate-100 hover:bg-emerald-50 transition ${
                    statusFilter === "inprogress" ? "text-emerald-600 bg-emerald-50" : "text-slate-700"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => {
                    handleStatusFilterChange("done");
                    setOpenStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-slate-100 hover:bg-blue-50 transition ${
                    statusFilter === "done" ? "text-blue-600 bg-blue-50" : "text-slate-700"
                  }`}
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    handleStatusFilterChange("cancelled");
                    setOpenStatusDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-red-50 transition ${
                    statusFilter === "cancelled" ? "text-red-600 bg-red-50" : "text-slate-700"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            )}
          </div>
        </div>

        {notice ? <div className="mb-5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">{notice}</div> : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center font-semibold text-slate-400">Loading...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-white py-20 text-center">
            <FiDroplet className="mx-auto mb-3 text-5xl text-red-200" />
            <p className="font-semibold text-slate-500">{statusFilter === "all" ? "You have not created any requests yet." : `No ${statusMeta[statusFilter]?.label.toLowerCase()} requests found.`}</p>
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
                Showing <span className="font-black text-slate-900">{startIndex + 1}</span> to <span className="font-black text-slate-900">{Math.min(startIndex + itemsPerPage, filteredRequests.length)}</span> of <span className="font-black text-slate-900">{filteredRequests.length}</span> results
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
