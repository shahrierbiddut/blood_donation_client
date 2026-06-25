"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiMoreVertical, FiLock, FiUnlock, FiUser, FiShield, FiEye, FiX, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import StatusBadge from "@/Components/Admin/StatusBadge";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUserById,
  updateUserProfile,
} from "@/services/adminService";

const USERS_PER_PAGE = 10;
const STATUS_FILTERS = [
  { label: "All Users", value: "all" },
  { label: "Active Users", value: "active" },
  { label: "Blocked Users", value: "blocked" }
];

const formatJoinedDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
};

function RoleBadge({ role }) {
  const classes = {
    admin: "bg-red-50 text-red-600",
    volunteer: "bg-blue-50 text-blue-600",
    donor: "bg-emerald-50 text-emerald-600"
  };

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold capitalize ${classes[role] || "bg-slate-100 text-slate-600"}`}>
      {role || "user"}
    </span>
  );
}

function UserAvatar({ user }) {
  if (user?.avatar) {
    return <Image src={user.avatar} alt={user.name || "User"} width={36} height={36} className="h-9 w-9 rounded-full object-cover" unoptimized />;
  }

  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-sm font-black text-red-600">
      {(user?.name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsPageLoading(true);
        const response = await getAllUsers({ page: 1, limit: 100 });
        const userList = Array.isArray(response?.data?.users) ? response.data.users : [];
        setUsers(userList);
      } catch (error) {
        toast.error(error?.message || "Failed to load users");
      } finally {
        setIsPageLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = filteredUsers.length === 0 ? 0 : (safeCurrentPage - 1) * USERS_PER_PAGE + 1;
  const endIndex = Math.min(safeCurrentPage * USERS_PER_PAGE, filteredUsers.length);
  const paginatedUsers = filteredUsers.slice((safeCurrentPage - 1) * USERS_PER_PAGE, safeCurrentPage * USERS_PER_PAGE);
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  const handleBlockUser = async (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    setLoadingUserId(userId);
    try {
      const nextStatus = user.status === "blocked" ? "active" : "blocked";
      const response = await updateUserStatus(userId, nextStatus);

      if (response.success) {
        setUsers((currentUsers) =>
          currentUsers.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
        );
        toast.success(`${user.name} has been ${nextStatus === "blocked" ? "blocked" : "unblocked"}`);
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user status");
      console.error("Block user error:", error);
    } finally {
      setLoadingUserId(null);
      setActiveDropdown(null);
    }
  };

  const handleMakeVolunteer = async (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const nextRole = user.role === "volunteer" ? "donor" : "volunteer";
    
    setLoadingUserId(userId);
    try {
      const response = await updateUserRole(userId, nextRole);

      if (response.success) {
        setUsers((currentUsers) =>
          currentUsers.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
        );
        toast.success(`${user.name} is now a ${nextRole}`);
      } else {
        toast.error(response.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user role");
      console.error("Make volunteer error:", error);
    } finally {
      setLoadingUserId(null);
      setActiveDropdown(null);
    }
  };

  const handleMakeAdmin = async (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const nextRole = user.role === "admin" ? "donor" : "admin";

    setLoadingUserId(userId);
    try {
      const response = await updateUserRole(userId, nextRole);

      if (response.success) {
        setUsers((currentUsers) =>
          currentUsers.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
        );
        toast.success(`${user.name} is now ${nextRole === "admin" ? "an admin" : `a ${nextRole}`}`);
      } else {
        toast.error(response.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user role");
      console.error("Make admin error:", error);
    } finally {
      setLoadingUserId(null);
      setActiveDropdown(null);
    }
  };

  const handleSetRole = async (userId, nextRole) => {
    const user = users.find((u) => u._id === userId);
    if (!user || user.role === nextRole) {
      setActiveDropdown(null);
      return;
    }

    setLoadingUserId(userId);
    try {
      const response = await updateUserRole(userId, nextRole);

      if (response.success) {
        setUsers((currentUsers) =>
          currentUsers.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
        );
        const roleLabel = nextRole === "admin" ? "an admin" : `a ${nextRole}`;
        toast.success(`${user.name} is now ${roleLabel}`);
      } else {
        toast.error(response.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user role");
      console.error("Set role error:", error);
    } finally {
      setLoadingUserId(null);
      setActiveDropdown(null);
    }
  };

  const handleViewProfile = async (user) => {
    try {
      const response = await getUserById(user._id);
      const userDetails = response?.data || user;
      setSelectedUser(userDetails);
      setEditFormData({ ...userDetails });
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error?.message || "Failed to load profile");
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!selectedUser) return;

    try {
      const profilePayload = {
        name: editFormData.name,
        phone: editFormData.phone,
        bloodGroup: editFormData.bloodGroup,
        division: editFormData.division,
        district: editFormData.district,
        upazila: editFormData.upazila,
        union: editFormData.union,
        address: editFormData.address,
        avatar: editFormData.avatar,
      };

      const response = await updateUserProfile(selectedUser._id, profilePayload);

      if (response.success) {
        const updatedUser = response?.data || { ...selectedUser, ...profilePayload };
        setUsers((currentUsers) =>
          currentUsers.map((u) =>
            u._id === selectedUser._id ? { ...u, ...updatedUser } : u
          )
        );
        setSelectedUser(updatedUser);
        setEditFormData(updatedUser);
        setIsEditingProfile(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      console.error("Save profile error:", error);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
    setIsEditingProfile(false);
    setEditFormData({});
  };

  const runMenuAction = (action) => {
    action();
    setActiveDropdown(null);
  };

  const ActionMenu = ({ user }) => (
    <div
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
        disabled={loadingUserId === user._id}
        className="p-2 hover:bg-red-50 rounded-lg transition duration-200 text-gray-600 hover:text-red-600 disabled:opacity-50"
        aria-label={`Open actions for ${user.name}`}
      >
        <FiMoreVertical size={18} />
      </button>

      {activeDropdown === user._id && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {user.status === "blocked" ? (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleBlockUser(user._id))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 text-emerald-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiUnlock size={16} /> Unblock User
            </button>
          ) : (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleBlockUser(user._id))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiLock size={16} /> Block User
            </button>
          )}

          {user.role === "volunteer" ? (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleMakeVolunteer(user._id))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiUser size={16} /> Make Donor
            </button>
          ) : (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleSetRole(user._id, "volunteer"))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiUser size={16} /> Make Volunteer
            </button>
          )}

          {user.role === "admin" ? (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleMakeAdmin(user._id))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiShield size={16} /> Remove Admin
            </button>
          ) : (
            <button
              type="button"
              onClick={() => runMenuAction(() => handleMakeAdmin(user._id))}
              disabled={loadingUserId === user._id}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-600 text-sm font-semibold transition duration-150 border-b border-slate-100 disabled:opacity-50"
            >
              <FiShield size={16} /> Make Admin
            </button>
          )}

          <button
            type="button"
            onClick={() => runMenuAction(() => handleViewProfile(user))}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700 text-sm font-semibold transition duration-150"
          >
            <FiEye size={16} /> View Profile
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900">All Users</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Manage roles, account status, and registered user profiles.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[180px_280px]">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Filter by Status</span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-400"
              >
                {STATUS_FILTERS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="relative block self-end">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto px-5 pt-5">
          <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isPageLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">Loading users...</td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">No users found for this filter.</td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <UserAvatar user={user} />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{user.email}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{user.name}</td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-600">{formatJoinedDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <ActionMenu user={user} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div className="mx-5 flex flex-col gap-4 border-t border-slate-100 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-500">
            Showing {startIndex} to {endIndex} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>
            {visiblePages[0] > 1 ? <span className="px-1 text-sm font-bold text-slate-400">...</span> : null}
            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-bold transition ${
                  safeCurrentPage === page ? "bg-red-600 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            {visiblePages[visiblePages.length - 1] < totalPages ? <span className="px-1 text-sm font-bold text-slate-400">...</span> : null}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
          <p className="text-center text-xs font-semibold text-slate-500">
            User management keeps donor access, volunteer permissions, and admin controls organized in one place.
          </p>
        </div>
      </section>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}&apos;s Profile</h2>
              <button
                onClick={handleCloseProfile}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {selectedUser.bloodGroup}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : selectedUser.role === "volunteer"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {selectedUser.role}
                    </span>
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ""}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone || ""}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={editFormData.bloodGroup || ""}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select Blood Group</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Division
                    </label>
                    <input
                      type="text"
                      name="division"
                      value={editFormData.division || ""}
                      onChange={handleProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={editFormData.district || ""}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upazila
                      </label>
                      <input
                        type="text"
                        name="upazila"
                        value={editFormData.upazila || ""}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editFormData.address || ""}
                      onChange={handleProfileInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoTile label="Email" value={selectedUser.email} />
                  <InfoTile label="Phone" value={selectedUser.phone} />
                  <InfoTile label="Blood Group" value={selectedUser.bloodGroup} tone="red" strong />
                  <InfoTile label="Division" value={selectedUser.division} />
                  <InfoTile label="District" value={selectedUser.district} />
                  <InfoTile label="Upazila" value={selectedUser.upazila} />
                  <InfoTile label="Address" value={selectedUser.address} />
                  <InfoTile label="Total Donations" value={selectedUser.totalDonations || 0} />
                  <InfoTile label="Joined Date" value={selectedUser.createdAt} />

                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value, tone = "slate", strong = false, className = "" }) {
  const toneClasses = {
    slate: "text-slate-600",
    red: "text-red-600",
    blue: "text-blue-600"
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-slate-50 rounded-lg ${className}`}>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className={`text-sm ${strong ? "font-semibold" : "font-normal"} ${toneClasses[tone]}`}>
        {value || "N/A"}
      </span>
    </div>
  );
}
