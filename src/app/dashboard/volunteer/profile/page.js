"use client";

import Image from "next/image";
import { useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import VolunteerSidebar from "@/Components/Shared/VolunteerSidebar";
import { useAuth } from "@/context/AuthContext";
import uploadService from "@/services/uploadService";
import {
  FiAlertCircle,
  FiCamera,
  FiCheckCircle,
  FiDroplet,
  FiEdit3,
  FiHeart,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShield,
  FiUser,
  FiX
} from "react-icons/fi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const fallbackAvatar = "https://i.pravatar.cc/120?img=20";

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
  avatar: user?.avatar || "",
  emergencyContact: user?.emergencyContact || "",
  medicalHistory: user?.medicalHistory || ""
});

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-400">
        {Icon ? <Icon className="text-red-500" /> : null}
        {label}
      </div>
      <p className="mt-1 min-h-5 text-sm font-semibold text-slate-800">{value || "Not provided"}</p>
    </div>
  );
}

function Field({ label, name, value, onChange, options, disabled = false, placeholder = "", type = "text" }) {
  const inputClass = "mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-400 disabled:bg-slate-100 disabled:text-slate-500";

  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase text-slate-400">{label}</span>
      {options ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled} className={inputClass}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className={inputClass} />
      )}
    </label>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase text-slate-400">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-400"
      />
    </label>
  );
}

function VolunteerProfileContent() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(user));
  const [saving, setSaving] = useState(false);
  const [avatarProcessing, setAvatarProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeForm = isEditing ? form : buildForm(user);
  const displayAvatar = activeForm.avatar || fallbackAvatar;
  const isActive = user?.status === "active";
  const location = [activeForm.address, activeForm.union, activeForm.upazila, activeForm.district].filter(Boolean).join(", ");

  const startEditing = () => {
    setForm(buildForm(user));
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(buildForm(user));
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") return;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setAvatarProcessing(true);
      setError("");
      const avatarUrl = await uploadService.uploadAvatar(file);
      setForm((current) => ({ ...current, avatar: avatarUrl }));
    } catch (uploadError) {
      setError(uploadError?.message || "Failed to process selected image.");
    } finally {
      setAvatarProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (avatarProcessing) {
      setError("Please wait, image is still processing.");
      return;
    }

    const requiredFields = ["name", "bloodGroup", "division", "district", "upazila", "union"];
    const missingField = requiredFields.find((field) => !String(form[field] || "").trim());
    if (missingField) {
      setError(`${missingField} is required.`);
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const { email, ...payload } = form;
      const response = await updateProfile(payload);
      setForm(buildForm(response?.user || user));
      setMessage(response?.message || "Profile updated successfully.");
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-8">
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Volunteer Profile</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">Manage your public volunteer information and contact details.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                <FiShield /> {isActive ? "Active" : "Blocked"}
              </span>
              {isEditing ? (
                <>
                  <button type="submit" disabled={saving || avatarProcessing} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700 disabled:bg-red-300">
                    <FiSave /> {avatarProcessing ? "Processing..." : saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-red-200 hover:text-red-600">
                    <FiX /> Cancel
                  </button>
                </>
              ) : (
                <button type="button" onClick={startEditing} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-red-600">
                  <FiEdit3 /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <section className="bg-slate-900 px-6 py-7 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 shrink-0">
                  <Image src={displayAvatar} alt={activeForm.name || "Volunteer"} width={112} height={112} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl" unoptimized />
                  {isEditing ? (
                    <label className="absolute bottom-1 right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700">
                      <FiCamera />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  ) : null}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-3xl font-black">{activeForm.name || "Volunteer"}</h2>
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">Volunteer</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <FiMapPin /> {location || "Location not provided"}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <FiPhone /> {activeForm.phone || "Phone not provided"}
                  </p>
                </div>
              </div>

              <div className="grid w-fit grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white px-5 py-4 text-center text-red-600">
                  <p className="text-[11px] font-black uppercase">Blood Group</p>
                  <p className="mt-1 text-3xl font-black">{activeForm.bloodGroup || "N/A"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/10 px-5 py-4 text-center text-white">
                  <p className="text-[11px] font-black uppercase text-slate-300">Helped</p>
                  <p className="mt-1 text-3xl font-black">{user?.totalDonations ?? 0}</p>
                </div>
              </div>
            </div>
          </section>

          {message || error ? (
            <div className={`mx-6 mt-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold ${error ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
              {error ? <FiAlertCircle /> : <FiCheckCircle />}
              {error || message}
            </div>
          ) : null}

          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiUser className="text-red-500" /> Personal Information
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {isEditing ? (
                    <>
                      <Field label="Full Name" name="name" value={form.name} onChange={handleChange} />
                      <Field label="Email" name="email" value={form.email} onChange={handleChange} disabled />
                      <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+880..." />
                      <Field label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="+880..." />
                    </>
                  ) : (
                    <>
                      <InfoTile icon={FiUser} label="Full Name" value={user?.name} />
                      <InfoTile label="Email" value={user?.email} />
                      <InfoTile icon={FiPhone} label="Phone" value={user?.phone} />
                      <InfoTile icon={FiPhone} label="Emergency Contact" value={user?.emergencyContact} />
                    </>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiMapPin className="text-red-500" /> Address Details
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {isEditing ? (
                    <>
                      <Field label="Division" name="division" value={form.division} onChange={handleChange} />
                      <Field label="District" name="district" value={form.district} onChange={handleChange} />
                      <Field label="Upazila" name="upazila" value={form.upazila} onChange={handleChange} />
                      <Field label="Union" name="union" value={form.union} onChange={handleChange} />
                      <div className="md:col-span-2">
                        <Field label="Address" name="address" value={form.address} onChange={handleChange} />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoTile label="Division" value={user?.division} />
                      <InfoTile label="District" value={user?.district} />
                      <InfoTile label="Upazila" value={user?.upazila} />
                      <InfoTile label="Union" value={user?.union} />
                      <div className="md:col-span-2">
                        <InfoTile label="Address" value={user?.address} />
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiHeart className="text-red-500" /> Health Notes
                </h3>
                {isEditing ? (
                  <TextAreaField label="Medical History" name="medicalHistory" value={form.medicalHistory} onChange={handleChange} placeholder="Add allergies, medication, or any important health note." />
                ) : (
                  <InfoTile label="Medical History" value={user?.medicalHistory} />
                )}
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiDroplet className="text-red-500" /> Blood Profile
                </h3>
                {isEditing ? (
                  <Field label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} options={BLOOD_GROUPS} />
                ) : (
                  <InfoTile label="Blood Group" value={user?.bloodGroup} />
                )}
                <div className="mt-3">
                  <InfoTile label="Total Contributions" value={String(user?.totalDonations ?? 0)} />
                </div>
                <div className="mt-3">
                  <InfoTile label="Last Donation" value={formatDate(user?.lastDonationDate)} />
                </div>
              </section>

              <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
                  <FiShield className="text-red-500" /> Account
                </h3>
                <InfoTile label="Role" value={user?.role} />
                <div className="mt-3">
                  <InfoTile label="Status" value={user?.status} />
                </div>
                <div className="mt-3">
                  <InfoTile label="Member Since" value={formatDate(user?.createdAt)} />
                </div>
              </section>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function VolunteerProfilePage() {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className="flex min-h-screen bg-gray-50">
        <VolunteerSidebar />
        <VolunteerProfileContent />
      </div>
    </ProtectedRoute>
  );
}
