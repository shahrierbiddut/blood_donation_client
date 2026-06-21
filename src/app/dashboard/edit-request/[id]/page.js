"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";

function EditRequestContent() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    recipientName: "",
    district: "",
    upazila: "",
    hospitalName: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await donationService.getOne(params.id);
        const source = res?.data || mockDonationRequests.find((item) => item._id === params.id);
        if (source) {
          setForm({
            recipientName: source.recipientName || "",
            district: source.district || "",
            upazila: source.upazila || "",
            hospitalName: source.hospitalName || "",
            bloodGroup: source.bloodGroup || "",
            donationDate: source.donationDate ? source.donationDate.slice(0, 10) : "",
            donationTime: source.donationTime || "",
            requestMessage: source.requestMessage || ""
          });
        }
      } catch {
        const source = mockDonationRequests.find((item) => item._id === params.id);
        if (source) {
          setForm({
            recipientName: source.recipientName || "",
            district: source.district || "",
            upazila: source.upazila || "",
            hospitalName: source.hospitalName || "",
            bloodGroup: source.bloodGroup || "",
            donationDate: source.donationDate ? source.donationDate.slice(0, 10) : "",
            donationTime: source.donationTime || "",
            requestMessage: source.requestMessage || ""
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) load();
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await donationService.update(params.id, form);
    } catch {
      // Ignore API error in demo mode.
    } finally {
      setSubmitting(false);
      router.push(`/donation-requests/${params.id}`);
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h1 className="mb-5 text-2xl font-black text-slate-900">Edit Donation Request</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["recipientName", "Recipient Name"],
              ["district", "District"],
              ["upazila", "Upazila"],
              ["hospitalName", "Hospital Name"],
              ["bloodGroup", "Blood Group"],
              ["donationDate", "Donation Date"]
            ].map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">{label}</span>
                <input
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3"
                />
              </label>
            ))}
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-slate-700">Donation Time</span>
              <input name="donationTime" value={form.donationTime} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 px-3" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-slate-700">Message</span>
              <textarea name="requestMessage" value={form.requestMessage} onChange={handleChange} rows={4} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">{submitting ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function EditRequestPage() {
  return (
    <ProtectedRoute>
      <EditRequestContent />
    </ProtectedRoute>
  );
}
