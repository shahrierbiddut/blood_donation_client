"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import uploadService from "@/services/uploadService";
import { useState } from "react";
import {
  FiHome,
  FiDroplet,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiPhone,
  FiX,
  FiCamera
} from "react-icons/fi";

const fallbackAvatar = "https://i.pravatar.cc/120?img=20";

const getProfileFromUser = (user) => ({
  name: user?.name || "Volunteer User",
  email: user?.email || "volunteer@gmail.com",
  phone: user?.phone || "",
  role: user?.role || "volunteer",
  address: user?.address || "",
  avatar: user?.avatar || fallbackAvatar
});

export default function VolunteerSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileData, setProfileData] = useState(() => getProfileFromUser(user));
  const visibleProfile = getProfileFromUser(user || profileData);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfileUpdate = async () => {
    if (isAvatarProcessing) {
      setProfileError("Please wait, image is still processing.");
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileError("");

      const response = await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone?.trim() || "",
        address: profileData.address?.trim() || "",
        avatar: profileData.avatar || ""
      });

      if (response?.user) {
        setProfileData((prev) => ({
          ...prev,
          ...response.user,
          avatar: response.user.avatar || fallbackAvatar
        }));
      }

      setShowProfileEdit(false);
    } catch (error) {
      setProfileError(error?.message || "Profile update failed. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const openProfileEdit = () => {
    setProfileError("");
    setProfileData(getProfileFromUser(user || profileData));
    setShowProfileEdit(true);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAvatarProcessing(true);
      setProfileError("");
      const avatarUrl = await uploadService.uploadAvatar(file);
      setProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
    } catch (error) {
      setProfileError(error?.message || "Failed to load the selected image.");
    } finally {
      setIsAvatarProcessing(false);
    }
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { path: "/dashboard/volunteer", label: "Dashboard", icon: FiHome },
    { path: "/dashboard/volunteer/all-requests", label: "All Blood Requests", icon: FiDroplet },
    { path: "/dashboard/volunteer/profile", label: "Profile", icon: FiUser },
    { path: "/dashboard/volunteer/settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <>
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 hidden md:flex flex-col h-screen sticky top-0 text-white shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 shadow-lg shadow-red-950/30">
              <FiDroplet size={19} className="text-white" />
              <FiHeart size={10} className="absolute bottom-1 right-1 text-red-100" />
            </div>
            <div>
              <h1 className="text-lg font-black">BLOOD DONATION</h1>
              <p className="text-xs text-red-400 font-semibold">VOLUNTEER</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Volunteer Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FiPhone size={16} className="text-red-400" />
              <p className="text-sm font-semibold">Need Help?</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">Contact support team</p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Contact Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={visibleProfile.avatar}
                alt={visibleProfile.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-red-400/60 shadow-lg"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{visibleProfile.name}</p>
                <p className="text-xs text-red-400 font-semibold capitalize">{visibleProfile.role}</p>
              </div>
              <button
                onClick={openProfileEdit}
                className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                title="Edit Profile"
              >
                <FiEdit2 size={14} className="text-slate-300" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium justify-center"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
              <button onClick={() => setShowProfileEdit(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <label className="relative cursor-pointer group">
                  <Image
                    src={profileData.avatar || fallbackAvatar}
                    alt={profileData.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-red-200 shadow-lg transition-all group-hover:ring-red-400"
                    unoptimized
                  />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all">
                    <FiCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isSavingProfile || isAvatarProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  {isAvatarProcessing ? "Processing..." : isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  disabled={isSavingProfile}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              {profileError ? (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{profileError}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
