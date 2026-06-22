"use client";

import Image from "next/image";
import { useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import { useAuth } from "@/context/AuthContext";
import { FiDroplet, FiEdit3, FiMail, FiMapPin, FiPhone, FiSave, FiShield, FiUser, FiX } from "react-icons/fi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const buildForm = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  bloodGroup: user?.bloodGroup || "A+",
  division: user?.division || "",
  district: user?.district || "",
  upazila: user?.upazila || "",
  union: user?.union || "",
  address: user?.address || "",
  avatar: user?.avatar || ""
});

function InfoField({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 min-h-5 text-sm font-semibold text-slate-800">{value || "Not provided"}</p>
    </div>
  );
}

function EditField({ label, name, value, onChange, type = "text", disabled = false, options }) {
  const baseClass = "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-400 disabled:bg-slate-100 disabled:text-slate-500";

  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
      {options ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled} className={baseClass}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} disabled={disabled} className={baseClass} />
      )}
    </label>
  );
}

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isActive = user?.status === "active";
  const isDonor = user?.isDonor !== false;
  const fullAddress = [user?.address, user?.union, user?.upazila, user?.district].filter(Boolean).join(", ");
  const form = draft || buildForm(user);
  const displayAvatar = form.avatar || user?.avatar;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") return;
    setDraft((current) => ({ ...(current || buildForm(user)), [name]: value }));
  };

  const handleCancel = () => {
    setDraft(null);
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { email, ...payload } = form;
      const response = await updateProfile(payload);
      setMessage(response?.message || "Profile updated successfully.");
      setDraft(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                My <span className="text-red-600">Profile</span>
              </h1>
              <p className="text-sm text-slate-500">Your registered donor information and account status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                <FiShield /> {isActive ? "Active Status" : "Blocked Status"}
              </span>
              {isEditing ? (
                <>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                    <FiSave /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-200 hover:text-red-600">
                    <FiX /> Cancel
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => { setDraft(buildForm(user)); setIsEditing(true); }} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-red-600">
                  <FiEdit3 /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <section className="relative bg-red-950 px-6 py-8 text-white">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:18px_18px]" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                {displayAvatar ? (
                  <Image src={displayAvatar} alt={form.name || "Profile"} width={112} height={112} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl" unoptimized />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-red-100 text-4xl font-black text-red-600 shadow-xl">
                    {(form.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-3xl font-black">{form.name || "Donor"}</h2>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-emerald-700">
                      {isDonor ? "Active Donor" : "Member"}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-red-100">
                    <FiMapPin /> {[form.address, form.union, form.upazila, form.district].filter(Boolean).join(", ") || fullAddress || "Location not provided"}
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-2xl border border-white/20 bg-white px-6 py-4 text-center text-red-600 shadow-lg">
                <p className="text-[11px] font-black uppercase tracking-wide">Blood Group</p>
                <p className="mt-1 text-4xl font-black">{form.bloodGroup || "N/A"}</p>
              </div>
            </div>
          </section>

          {(message || error) ? (
            <div className={`mx-6 mt-5 rounded-xl border px-4 py-3 text-sm font-bold ${error ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
              {error || message}
            </div>
          ) : null}

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiUser className="text-red-500" /> Personal Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {isEditing ? (
                    <>
                      <EditField label="Full Name" name="name" value={form.name} onChange={handleChange} />
                      <EditField label="Email" name="email" value={form.email} onChange={handleChange} disabled />
                      <EditField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                      <EditField label="Avatar URL" name="avatar" value={form.avatar} onChange={handleChange} />
                    </>
                  ) : (
                    <>
                      <InfoField label="Full Name" value={user?.name} />
                      <InfoField label="Email" value={user?.email} />
                      <InfoField label="Phone" value={user?.phone} />
                      <InfoField label="Role" value={user?.role} />
                    </>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiMapPin className="text-red-500" /> Address Details
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {isEditing ? (
                    <>
                      <EditField label="Division" name="division" value={form.division} onChange={handleChange} />
                      <EditField label="District" name="district" value={form.district} onChange={handleChange} />
                      <EditField label="Upazila" name="upazila" value={form.upazila} onChange={handleChange} />
                      <EditField label="Union" name="union" value={form.union} onChange={handleChange} />
                      <div className="sm:col-span-2">
                        <EditField label="Address" name="address" value={form.address} onChange={handleChange} />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoField label="Division" value={user?.division} />
                      <InfoField label="District" value={user?.district} />
                      <InfoField label="Upazila" value={user?.upazila} />
                      <InfoField label="Union" value={user?.union} />
                      <div className="sm:col-span-2">
                        <InfoField label="Address" value={user?.address} />
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className={`rounded-2xl border px-5 py-4 ${isActive ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${isActive ? "bg-emerald-600" : "bg-red-600"}`}>
                    <FiShield />
                  </span>
                  <div>
                    <h3 className={`font-black ${isActive ? "text-emerald-800" : "text-red-800"}`}>
                      {isActive ? "Active Donor" : "Blocked Account"}
                    </h3>
                    <p className={`mt-1 text-sm ${isActive ? "text-emerald-700" : "text-red-700"}`}>
                      {isActive ? "Your account is active and ready to help with donation requests." : "Your account is currently blocked. Please contact support."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiDroplet className="text-red-500" /> Medical Profile
                </h3>
                {isEditing ? (
                  <EditField label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} options={BLOOD_GROUPS} />
                ) : (
                  <InfoField label="Blood Group" value={user?.bloodGroup} />
                )}
                <div className="mt-3">
                  <InfoField label="Total Donations" value={String(user?.totalDonations ?? 0)} />
                </div>
                <div className="mt-3">
                  <InfoField label="Last Donation" value={formatDate(user?.lastDonationDate)} />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-black text-slate-900">Contact</h3>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiMail className="text-red-500" /> {user?.email || "Not provided"}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiPhone className="text-red-500" /> {form.phone || user?.phone || "Not provided"}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Member Since</p>
                <p className="mt-1 text-lg font-black text-red-600">{formatDate(user?.createdAt)}</p>
              </section>
            </aside>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
