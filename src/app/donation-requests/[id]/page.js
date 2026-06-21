"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiMapPin, FiCalendar, FiClock, FiPhone, FiMail } from "react-icons/fi";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";

const statusClass = {
  pending: "bg-slate-100 text-slate-700",
  inprogress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600"
};

export default function DonationRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-red-600">Dashboard</Link> / <Link href="/dashboard/my-requests" className="hover:text-red-600">My Requests</Link> / <span className="text-slate-600">Details</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                {request.requester?.avatar ? (
                  <Image src={request.requester.avatar} alt={request.recipientName} width={56} height={56} className="h-14 w-14 rounded-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 font-black text-red-600">{request.recipientName?.charAt(0) || "R"}</div>
                )}
                <div>
                  <h1 className="text-xl font-black text-slate-900">{request.recipientName}</h1>
                  <div className="mt-1 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">{request.bloodGroup}</div>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><FiMapPin /> {request.district}, {request.upazila}</p>
              <p className="mt-1 text-sm text-slate-500">{request.hospitalName}</p>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Donation Date</span><span className="font-semibold text-slate-800">{new Date(request.donationDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Donation Time</span><span className="font-semibold text-slate-800">{request.donationTime}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Blood Group</span><span className="font-semibold text-slate-800">{request.bloodGroup}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[request.status] || statusClass.pending}`}>{request.status}</span></div>
              <div>
                <p className="mb-1 text-slate-500">Message</p>
                <p className="font-medium text-slate-800">{request.requestMessage || "No additional message."}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Donor Information</h2>
            {request.donor ? (
              <div className="mt-4 rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  {request.donor.avatar ? (
                    <Image src={request.donor.avatar} alt={request.donor.name} width={52} height={52} className="h-13 w-13 rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">{request.donor.name?.charAt(0) || "D"}</div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900">{request.donor.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><FiMail /> {request.donor.email}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><FiPhone /> 01712-345678</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><FiMapPin /> {request.district}, {request.upazila}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No donor assigned yet.</p>
            )}

            <div className="mt-6 space-y-2">
              <button className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">Mark as Done</button>
              <button className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white">Cancel Request</button>
              <button onClick={() => router.push(`/dashboard/edit-request/${request._id}`)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">Edit Request</button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
