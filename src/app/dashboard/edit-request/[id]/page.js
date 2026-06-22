"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";
import { FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" }
];

function EditRequestContent() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    recipientName: "",
    bloodGroup: "",
    hospitalName: "",
    upazila: "",
    district: "",
    donationDate: "",
    donationTime: "",
    status: "pending"
  });

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        setError("");
        let data = null;

        // Try to fetch from API
        if (!String(requestId).startsWith("mock-")) {
          try {
            const response = await donationService.getOne(requestId);
            if (response?.success && response.data) {
              data = response.data;
            }
          } catch (err) {
            // Fall back to mock data
            data = mockDonationRequests.find(r => r._id === requestId);
          }
        } else {
          // Use mock data
          data = mockDonationRequests.find(r => r._id === requestId);
        }

        if (!data) {
          setError("Request not found");
          return;
        }

        setRequest(data);
        setFormData({
          recipientName: data.recipientName || "",
          bloodGroup: data.bloodGroup || "",
          hospitalName: data.hospitalName || "",
          upazila: data.upazila || "",
          district: data.district || "",
          donationDate: data.donationDate ? data.donationDate.split("T")[0] : "",
          donationTime: data.donationTime || "",
          status: data.status || "pending"
        });
      } catch (err) {
        setError(err.message || "Failed to load request");
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [requestId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.recipientName.trim()) {
        setError("Recipient name is required");
        toast.error("Recipient name is required");
        return;
      }

      toast.loading("Updating request...");
      if (!String(requestId).startsWith("mock-")) {
        const response = await donationService.update(requestId, formData);
        if (response?.success) {
          toast.dismiss();
          toast.success("Request updated successfully!");
          setSuccess("Request updated successfully!");
          setTimeout(() => {
            router.push("/dashboard/my-requests");
          }, 1500);
        } else {
          toast.dismiss();
          const errorMsg = response?.message || "Failed to update request";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        // Mock update
        toast.dismiss();
        toast.success("Request updated successfully!");
        setSuccess("Request updated successfully!");
        setTimeout(() => {
          router.push("/dashboard/my-requests");
        }, 1500);
      }
    } catch (err) {
      toast.dismiss();
      const errorMsg = err.message || "Failed to save request";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptDonor = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Change status to inprogress when donor accepts
      const updateData = {
        ...formData,
        status: "inprogress"
      };

      toast.loading("Accepting donor...");
      if (!String(requestId).startsWith("mock-")) {
        const response = await donationService.update(requestId, updateData);
        if (response?.success) {
          toast.dismiss();
          toast.success("Donation accepted! Status changed to In Progress");
          setSuccess("Donation accepted! Status changed to In Progress");
          setTimeout(() => {
            router.push("/dashboard/my-requests");
          }, 1500);
        } else {
          toast.dismiss();
          const errorMsg = response?.message || "Failed to accept donation";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        toast.dismiss();
        toast.success("Donation accepted! Status changed to In Progress");
        setSuccess("Donation accepted! Status changed to In Progress");
        setTimeout(() => {
          router.push("/dashboard/my-requests");
        }, 1500);
      }
    } catch (err) {
      toast.dismiss();
      const errorMsg = err.message || "Failed to accept donation";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center font-semibold text-slate-400">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-red-200 bg-white py-20 text-center">
            <p className="font-semibold text-slate-500 mb-4">{error || "Request not found"}</p>
            <Link href="/dashboard/my-requests" className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
              Back to My Requests
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard/my-requests" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700">
            <FiArrowLeft /> Back
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Edit <span className="text-red-600">Request</span></h1>
          <p className="mt-2 text-sm text-slate-500">Update request details and manage donation status</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {success}
            </div>
          )}

          <div className="mt-8 space-y-6">
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Name *</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="Enter recipient name"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              >
                <option value="">Select blood group</option>
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="Enter hospital name"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="Enter district"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Upazila</label>
                <input
                  type="text"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="Enter upazila"
                />
              </div>
            </div>

            {/* Donation Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Donation Date</label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Donation Time</label>
                <input
                  type="time"
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                {formData.status === "pending" && "Waiting for donor response"}
                {formData.status === "inprogress" && "A donor has accepted and is preparing"}
                {formData.status === "done" && "Donation completed successfully"}
                {formData.status === "cancelled" && "Request has been cancelled"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700 disabled:bg-slate-300 transition flex items-center justify-center gap-2"
              >
                <FiCheck size={18} />
                Save Changes
              </button>

              {formData.status === "pending" && (
                <button
                  onClick={handleAcceptDonor}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:bg-slate-300 transition flex items-center justify-center gap-2"
                >
                  <FiCheck size={18} />
                  Accept Donation (In Progress)
                </button>
              )}

              <Link
                href="/dashboard/my-requests"
                className="flex-1 rounded-lg border border-slate-300 px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                <FiX size={18} />
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
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
