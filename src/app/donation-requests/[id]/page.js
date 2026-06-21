"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCalendar, FiClock, FiDroplet, FiMapPin } from "react-icons/fi";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";
import { useAuth } from "@/context/AuthContext";

const statusClass = {
  pending: "bg-amber-100 text-amber-800",
  inprogress: "bg-sky-100 text-sky-800",
  done: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600"
};
const statusLabel = {
  pending: "Pending",
  inprogress: "In Progress",
  done: "Done",
  cancelled: "Cancelled"
};

function DetailRow({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value || "Not provided"}</p>
    </div>
  );
}

export default function DonationRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState({ type: "", message: "", visible: false });

  const id = useMemo(() => params?.id, [params]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await donationService.getOne(id);
        if (res.success && res.data) {
          setRequest(res.data);
        } else {
          setRequest(mockDonationRequests.find((item) => item._id === id) || null);
        }
      } catch {
        setRequest(mockDonationRequests.find((item) => item._id === id) || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-400">Loading...</div>;
  }

  if (!request) {
    return <div className="min-h-screen grid place-items-center text-red-500">Request not found</div>;
  }

  const formattedDate = request.donationDate
    ? new Date(request.donationDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Not provided";
  const location = [request.district, request.upazila].filter(Boolean).join(", ");
  const requester = request.requester || {};
  const isOwner = user?._id && requester?._id && user._id === requester._id;
  const canDonate = request.status === "pending" && !isOwner;

  const showToast = (type, message) => {
    setToast({ type, message, visible: true });
    setTimeout(() => {
      setToast({ type: "", message: "", visible: false });
    }, 2600);
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      showToast("error", "Please login before accepting a donation request.");
      router.push("/login");
      return;
    }

    if (!request?._id) {
      showToast("error", "Request id is missing. Please refresh and try again.");
      return;
    }

    if (String(request._id).startsWith("mock-")) {
      setRequest((prev) => ({ ...prev, status: "inprogress" }));
      showToast("success", "Demo request accepted. Status changed to in progress.");
      return;
    }

    setActionLoading(true);
    setActionError("");
    try {
      const res = await donationService.accept(request._id);
      if (res.success && res.data) {
        setRequest(res.data);
        showToast("success", "Donation accepted. Status changed to in progress.");
      } else {
        const message = res?.message || "Unable to accept this request.";
        setActionError(message);
        showToast("error", message);
      }
    } catch (error) {
      const message = error.message || error.response?.data?.message || "Unable to accept this request.";
      setActionError(message);
      showToast("error", message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast.visible ? (
        <div className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 text-sm font-bold shadow-lg ${
          toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {toast.message}
        </div>
      ) : null}
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 text-xs text-slate-400">
          <Link href="/" className="hover:text-red-600">Home</Link> / <Link href="/donation-requests" className="hover:text-red-600">Donation Requests</Link> / <span className="text-slate-600">Details</span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-slate-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Request <span className="text-red-600">Details</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">View urgency, location, and donation requirements.</p>
            </div>
            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase ${statusClass[request.status] || statusClass.pending}`}>
              <FiClock /> {statusLabel[request.status] || request.status}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {request.requester?.avatar ? (
                  <Image src={request.requester.avatar} alt={request.recipientName} width={72} height={72} className="h-20 w-20 rounded-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-2xl font-black text-red-600">{request.recipientName?.charAt(0) || "R"}</div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Recipient</p>
                  <h2 className="text-2xl font-black text-slate-900">{request.recipientName}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                      <FiDroplet /> {request.bloodGroup}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Requested by {requester.name || "a registered member"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailRow label="Donation Date" value={formattedDate} />
                <DetailRow label="Donation Time" value={request.donationTime} />
                <DetailRow label="Blood Group" value={request.bloodGroup} />
                <DetailRow label="Hospital" value={request.hospitalName} />
                <DetailRow label="District" value={request.district} />
                <DetailRow label="Upazila" value={request.upazila} />
              </div>

              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-red-500">Requester Message</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{request.requestMessage || "No additional message."}</p>
              </div>
            </div>

            <aside className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current Status</p>
                <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase ${statusClass[request.status] || statusClass.pending}`}>
                  <FiClock /> {statusLabel[request.status] || request.status}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {request.status === "pending"
                    ? "No donor has accepted this request yet. Tap Donate to accept it."
                    : "This request is now in progress and no longer appears on the donation requests page."}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                  <FiMapPin className="mt-0.5 shrink-0 text-red-500" /> {location || "Location not provided"}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiCalendar className="text-red-500" /> {formattedDate}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiClock className="text-red-500" /> {request.donationTime || "Not provided"}
                </p>
              </div>

              {actionError ? (
                <div className="mt-4 flex gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  <FiAlertCircle className="mt-0.5 shrink-0" /> {actionError}
                </div>
              ) : null}

              <button
                onClick={handleDonate}
                disabled={!canDonate || actionLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                <FiDroplet />
                {actionLoading ? "Processing..." : request.status === "pending" ? "Donate" : "Donation In Progress"}
              </button>

              {isOwner ? (
                <p className="mt-3 text-center text-xs font-semibold text-slate-500">You cannot donate to your own request.</p>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
