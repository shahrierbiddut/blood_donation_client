"use client";

import Image from "next/image";
import { useState } from "react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import { useAuth } from "@/context/AuthContext";

function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    district: user?.district || "",
    upazila: user?.upazila || "",
    bloodGroup: user?.bloodGroup || "",
    avatar: user?.avatar || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
            <p className="text-sm text-slate-500">View and edit your donor profile information.</p>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[220px_1fr]">
            <div className="text-center">
              {form.avatar ? (
                <Image
                  src={form.avatar}
                  alt={form.name || "Profile"}
                  width={120}
                  height={120}
                  className="mx-auto h-30 w-30 rounded-full object-cover ring-2 ring-red-100"
                  unoptimized
                />
              ) : (
                <div className="mx-auto flex h-30 w-30 items-center justify-center rounded-full bg-red-100 text-3xl font-black text-red-600">
                  {(form.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-slate-700 capitalize">{user?.role || "donor"}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Full Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">District</span>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Upazila</span>
                <input
                  name="upazila"
                  value={form.upazila}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700">Blood Group</span>
                <input
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block font-semibold text-slate-700">Avatar URL</span>
                <input
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  disabled={!editing}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-slate-800 disabled:bg-slate-50"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            {editing ? (
              <>
                <button
                  onClick={() => {
                    setForm({
                      name: user?.name || "",
                      phone: user?.phone || "",
                      district: user?.district || "",
                      upazila: user?.upazila || "",
                      bloodGroup: user?.bloodGroup || "",
                      avatar: user?.avatar || ""
                    });
                    setEditing(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
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
