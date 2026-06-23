"use client";

import { useState, useEffect } from "react";
import { FiMoreVertical, FiLock, FiUnlock, FiUser, FiShield, FiEye, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import StatusBadge from "@/Components/Admin/StatusBadge";
import DataTable from "@/Components/Admin/DataTable";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getUserById,
  updateUserProfile,
} from "@/services/adminService";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const columns = [
    {
      key: "name",
      title: "User",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
            {row.name.charAt(0)}
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    { key: "email", title: "Email", render: (row) => <span className="text-gray-600 text-sm">{row.email}</span> },
    { key: "bloodGroup", title: "Blood Group", render: (row) => <span className="font-semibold text-red-600">{row.bloodGroup}</span> },
    {
      key: "role",
      title: "Role",
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          row.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : row.role === "volunteer"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}>
          {row.role}
        </span>
      ),
    },
    { key: "status", title: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", title: "Joined Date", render: (row) => <span className="text-gray-600 text-sm">{row.createdAt}</span> },
    { key: "actions", title: "Actions", render: (row) => <ActionMenu user={row} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Data Table */}
      {isPageLoading ? (
        <div className="text-sm text-gray-500">Loading users...</div>
      ) : (
        <DataTable columns={columns} data={filteredUsers} />
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}'s Profile</h2>
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