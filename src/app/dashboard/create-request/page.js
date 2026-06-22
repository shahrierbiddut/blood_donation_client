"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import ProtectedRoute from "@/Components/ProtectedRoute";
import donationService from "@/services/donationService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition";

const selectCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-50 disabled:text-slate-400";

function CreateRequestContent() {
  const router = useRouter();

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  useEffect(() => {
    fetch("/location/district.json")
      .then((r) => r.json())
      .then((json) => {
        const table = json.find((i) => i.type === "table");
        if (table) setDistricts(table.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDistrictId) return;
    fetch("/location/upazila.json")
      .then((r) => r.json())
      .then((json) => {
        const table = json.find((i) => i.type === "table");
        if (table) setUpazilas(table.data.filter((u) => u.district_id === selectedDistrictId));
      })
      .catch(() => {});
  }, [selectedDistrictId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    const selected = districts.find((d) => d.name === val);
    setForm((prev) => ({ ...prev, district: val, upazila: "" }));
    setSelectedDistrictId(selected ? selected.id : "");
    if (!selected) setUpazilas([]);
  };

  const validate = () => {
    const { recipientName, district, upazila, hospitalName, bloodGroup, donationDate, donationTime } = form;
    if (!recipientName.trim()) return "Recipient name is required.";
    if (!district) return "District is required.";
    if (!upazila) return "Upazila is required.";
    if (!hospitalName.trim()) return "Hospital name is required.";
    if (!bloodGroup) return "Blood group is required.";
    if (!donationDate) return "Donation date is required.";
    if (!donationTime) return "Donation time is required.";
    if (new Date(donationDate) < new Date().setHours(0, 0, 0, 0)) return "Donation date must be today or in the future.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Creating donation request...");
      await donationService.create(form);
      toast.dismiss();
      toast.success("Donation request created successfully!");
      setSuccess("Donation request created successfully!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      toast.dismiss();
      const errorMsg = err?.response?.data?.message || "Failed to create request. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Header */}
        <section className="border-b border-red-100 bg-white py-8">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-2 text-xs text-slate-400">
              <Link href="/dashboard" className="hover:text-red-500">Dashboard</Link>
              <span>/</span>
              <span className="font-medium text-slate-600">Create Request</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-900">Create Donation Request</h1>
          </div>
        </section>

        {/* Form */}
        <section className="py-8">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">Recipient Information</h2>
                  <p className="text-sm text-slate-500">Fill in the details for the blood donation request</p>
                </div>

                <div className="px-6 py-6">
                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {success}
                    </div>
                  )}

                  {/* Row 1: Recipient Name | District | Upazila */}
                  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Recipient Name" required>
                      <input
                        type="text"
                        name="recipientName"
                        value={form.recipientName}
                        onChange={handleChange}
                        placeholder="Enter recipient name"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Recipient District" required>
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleDistrictChange}
                        className={selectCls}
                      >
                        <option value="">Select district</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Recipient Upazila" required>
                      <select
                        name="upazila"
                        value={form.upazila}
                        onChange={handleChange}
                        disabled={!selectedDistrictId}
                        className={selectCls}
                      >
                        <option value="">Select upazila</option>
                        {upazilas.map((u) => (
                          <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Row 2: Hospital Name | Blood Group | Donation Date */}
                  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Hospital Name" required>
                      <input
                        type="text"
                        name="hospitalName"
                        value={form.hospitalName}
                        onChange={handleChange}
                        placeholder="Enter hospital name"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Blood Group" required>
                      <select
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        className={selectCls}
                      >
                        <option value="">Select blood group</option>
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Donation Date" required>
                      <input
                        type="date"
                        name="donationDate"
                        value={form.donationDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* Row 3: Donation Time (full width) */}
                  <div className="mb-5">
                    <Field label="Donation Time" required>
                      <input
                        type="time"
                        name="donationTime"
                        value={form.donationTime}
                        onChange={handleChange}
                        className={`${inputCls} max-w-xs`}
                      />
                    </Field>
                  </div>

                  {/* Row 4: Additional Message */}
                  <div className="mb-2">
                    <Field label="Additional Message">
                      <textarea
                        name="requestMessage"
                        value={form.requestMessage}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Any additional information about the request... (optional)"
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
                      />
                    </Field>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function CreateRequestPage() {
  return (
    <ProtectedRoute>
      <CreateRequestContent />
    </ProtectedRoute>
  );
}
