"use client";

import { useEffect, useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { users as mockUsers } from "@/data/adminMock";
import { FiMoreVertical, FiLock, FiUnlock, FiUser, FiShield, FiEye } from "react-icons/fi";
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
        className="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <FiMoreVertical size={18} className="text-gray-600" />
      </button>

      {activeDropdown === user.id && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {user.status === "blocked" ? (
            <button
              onClick={() => handleBlockUser(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-green-600 text-sm"
            >
              <FiUnlock size={16} /> Unblock User
            </button>
          ) : (
            <button
              onClick={() => handleBlockUser(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600 text-sm"
            >
              <FiLock size={16} /> Block User
            </button>
          )}

          {user.role === "volunteer" ? (
            <button
              onClick={() => handleMakeVolunteer(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 text-sm"
            >
              <FiUser size={16} /> Make Donor
            </button>
          ) : (
            <button
              onClick={() => handleMakeVolunteer(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 text-sm"
            >
              <FiUser size={16} /> Make Volunteer
            </button>
          )}

          {user.role === "admin" ? (
            <button
              onClick={() => handleMakeAdmin(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-purple-600 text-sm"
            >
              <FiShield size={16} /> Remove Admin
            </button>
          ) : (
            <button
              onClick={() => handleMakeAdmin(user.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-purple-600 text-sm"
            >
              <FiShield size={16} /> Make Admin
            </button>
          )}

          <button
            onClick={() => handleViewProfile(user)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-slate-600 text-sm border-t"
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">All Users</h1>
        <p className="text-gray-600 text-sm">Manage and monitor registered users</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DataTable columns={columns} data={filteredUsers} />
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedUser.name}</h2>
            <div className="space-y-2">
              <p className="text-gray-600"><strong>Email:</strong> {selectedUser.email}</p>
              <p className="text-gray-600"><strong>Blood Group:</strong> {selectedUser.bloodGroup}</p>
              <p className="text-gray-600"><strong>Role:</strong> {selectedUser.role}</p>
              <p className="text-gray-600"><strong>Status:</strong> {selectedUser.status}</p>
              <p className="text-gray-600"><strong>Joined:</strong> {selectedUser.createdAt}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
