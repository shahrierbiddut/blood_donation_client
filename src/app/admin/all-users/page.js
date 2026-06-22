"use client";

import { useEffect, useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { users as mockUsers } from "@/data/adminMock";
import { FiMoreVertical, FiLock, FiUnlock, FiUser, FiShield, FiEye, FiX, FiMail, FiPhone, FiMapPin, FiDroplet, FiHeart, FiEdit2, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AllUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!activeDropdown) return;

    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener("pointerdown", closeDropdown);
    return () => document.removeEventListener("pointerdown", closeDropdown);
  }, [activeDropdown]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUser = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(
      `${user.name} has been ${user.status === "blocked" ? "unblocked" : "blocked"}`
    );
    setActiveDropdown(null);
  };

  const handleMakeVolunteer = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: u.role === "volunteer" ? "donor" : "volunteer" } : u
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(
      `${user.name} is now a ${user.role === "volunteer" ? "donor" : "volunteer"}`
    );
    setActiveDropdown(null);
  };

  const handleMakeAdmin = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: u.role === "admin" ? "donor" : "admin" } : u
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.success(
      `${user.name} is now ${user.role === "admin" ? "a donor" : "an admin"}`
    );
    setActiveDropdown(null);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    toast.info(`Viewing profile: ${user.name}`);
    setActiveDropdown(null);
  };

  const ActionMenu = ({ user }) => (
    <div className="relative" onPointerDown={(event) => event.stopPropagation()}>
      <button
        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
        className="p-2 hover:bg-red-50 rounded-lg transition duration-200 text-gray-600 hover:text-red-600"
      >
        <FiMoreVertical size={18} />
      </button>

      {activeDropdown === user.id && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
          {user.status === "blocked" ? (
            <button
              onClick={() => handleBlockUser(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 text-emerald-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiUnlock size={16} /> Unblock User
            </button>
          ) : (
            <button
              onClick={() => handleBlockUser(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiLock size={16} /> Block User
            </button>
          )}

          {user.role === "volunteer" ? (
            <button
              onClick={() => handleMakeVolunteer(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiUser size={16} /> Make Donor
            </button>
          ) : (
            <button
              onClick={() => handleMakeVolunteer(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-blue-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiUser size={16} /> Make Volunteer
            </button>
          )}

          {user.role === "admin" ? (
            <button
              onClick={() => handleMakeAdmin(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiShield size={16} /> Remove Admin
            </button>
          ) : (
            <button
              onClick={() => handleMakeAdmin(user.id)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center gap-3 text-purple-600 text-sm font-semibold transition duration-150 border-b border-slate-100"
            >
              <FiShield size={16} /> Make Admin
            </button>
          )}

          <button
            onClick={() => handleViewProfile(user)}
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
    <div>
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">All Users</h1>
        <p className="text-gray-600 text-sm font-semibold mt-2">Manage and monitor registered users</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent shadow-sm transition"
          />
        </div>
        <div className="text-sm font-semibold text-gray-600 bg-slate-100 px-4 py-3 rounded-lg">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <DataTable columns={columns} data={filteredUsers} />
      </div>

      {selectedUser && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient Background */}
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white p-6 pb-12">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 hover:bg-red-600 rounded-lg transition"
              >
                <FiX size={24} />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-2xl shadow-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.role === "admin"
                        ? "bg-white/20 text-white"
                        : selectedUser.role === "volunteer"
                        ? "bg-blue-100/20 text-blue-100"
                        : "bg-white/20 text-white"
                    }`}>
                      {selectedUser.role === "admin" ? "🛡️ Admin" : selectedUser.role === "volunteer" ? "🤝 Volunteer" : "💉 Donor"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.status === "active"
                        ? "bg-green-100/20 text-green-100"
                        : "bg-red-100/20 text-red-100"
                    }`}>
                      {selectedUser.status === "active" ? "✓ Active" : "⛔ Blocked"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <FiUser size={16} /> Personal Information
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Full Name</span>
                    <span className="font-semibold text-gray-900">{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Gender</span>
                    <span className="font-semibold text-gray-900">{selectedUser.gender || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Date of Birth</span>
                    <span className="font-semibold text-gray-900">{selectedUser.dateOfBirth || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <FiMail size={16} /> Contact Information
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Email</span>
                    <span className="font-semibold text-gray-900 break-all">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Phone</span>
                    <span className="font-semibold text-gray-900">{selectedUser.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <FiMapPin size={16} /> Location Information
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Division</span>
                    <span className="font-semibold text-gray-900">{selectedUser.division || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">District</span>
                    <span className="font-semibold text-gray-900">{selectedUser.district || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Union</span>
                    <span className="font-semibold text-gray-900">{selectedUser.union || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <FiDroplet size={16} /> Donor Information
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Blood Group</span>
                    <span className="font-bold text-red-600 text-lg">{selectedUser.bloodGroup}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Donations</span>
                    <span className="font-semibold text-gray-900 bg-red-50 px-3 py-1 rounded-full">{selectedUser.totalDonations || 0} times</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Last Donation</span>
                    <span className="font-semibold text-gray-900">{selectedUser.lastDonation || "Never"}</span>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3 flex items-center gap-2">
                  <FiCheckCircle size={16} /> Account Information
                </h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Role</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : selectedUser.role === "volunteer"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedUser.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Joined Date</span>
                    <span className="font-semibold text-gray-900">{selectedUser.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedUser.totalDonations || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Donations</p>
                </div>
                <div className="text-center border-l border-red-200">
                  <p className="text-2xl font-bold text-red-600">{selectedUser.requestsFulfilled || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Requests Fulfilled</p>
                </div>
                <div className="text-center border-l border-red-200">
                  <p className="text-2xl font-bold text-red-600">{selectedUser.livesImpacted || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Lives Impacted</p>
                </div>
                <div className="text-center border-l border-red-200">
                  <p className="text-2xl font-bold text-red-600">{selectedUser.memberSince ? "1Y" : "New"}</p>
                  <p className="text-xs text-gray-600 mt-1">Member Since</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-bold uppercase text-red-600 mb-3">Quick Actions (Admin Only)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedUser.role !== "volunteer" ? (
                    <button
                      onClick={() => {
                        handleMakeVolunteer(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2"
                    >
                      <FiUser size={16} /> Make Volunteer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleMakeVolunteer(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2"
                    >
                      <FiUser size={16} /> Make Donor
                    </button>
                  )}

                  {selectedUser.role === "admin" ? (
                    <button
                      onClick={() => {
                        handleMakeAdmin(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition flex items-center justify-center gap-2"
                    >
                      <FiShield size={16} /> Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleMakeAdmin(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition flex items-center justify-center gap-2"
                    >
                      <FiShield size={16} /> Make Admin
                    </button>
                  )}

                  {selectedUser.status === "blocked" ? (
                    <button
                      onClick={() => {
                        handleBlockUser(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2 col-span-2"
                    >
                      <FiUnlock size={16} /> Unblock User
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleBlockUser(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2 col-span-2"
                    >
                      <FiLock size={16} /> Block User
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-4 flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <FiEdit2 size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
