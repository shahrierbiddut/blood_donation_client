"use client";

import { useState } from "react";
import DataTable from "@/Components/Admin/DataTable";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { requests as mockRequests } from "@/data/adminMock";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AllBloodDonationRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteRequest = (requestId) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    toast.success("Request deleted successfully");
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    toast.info(`Viewing request from ${request.recipientName}`);
  };

  const ActionButtons = ({ request }) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewRequest(request)}
        className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
        title="View"
      >
        <FiEye size={16} />
      </button>
      <button
        onClick={() => toast.info(`Edit request: ${request.id}`)}
        className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600"
        title="Edit"
      >
        <FiEdit2 size={16} />
      </button>
      <button
        onClick={() => handleDeleteRequest(request.id)}
        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
        title="Delete"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );

  const columns = [
    {
      key: "recipientName",
      title: "Recipient Name",
      render: (row) => <span className="font-medium text-gray-900">{row.recipientName}</span>,
    },
    {
      key: "location",
      title: "Location",
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {row.district}, {row.upazila}
        </span>
      ),
    },
    {
      key: "donationDate",
      title: "Donation Date",
      render: (row) => <span className="text-gray-600 text-sm">{row.donationDate}</span>,
    },
    {
      key: "donationTime",
      title: "Time",
      render: (row) => <span className="text-gray-600 text-sm">{row.donationTime}</span>,
    },
    {
      key: "bloodGroup",
      title: "Blood Group",
      render: (row) => <span className="font-bold text-red-600 text-sm">{row.bloodGroup}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "donor",
      title: "Donor Info",
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {row.donor ? `${row.donor.name}` : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => <ActionButtons request={row} />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">All Blood Donation Requests</h1>
        <p className="text-gray-600 text-sm">View and manage all blood donation requests</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 flex gap-4">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Recipient</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Blood Group</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      {request.recipientName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{request.recipientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-sm font-medium text-white bg-red-100">
                    {request.bloodGroup}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {request.district}, {request.upazila}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{request.donationDate}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionButtons request={request} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recipient Name</p>
                <p className="font-semibold text-gray-900">{selectedRequest.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                <p className="font-bold text-red-600 text-lg">{selectedRequest.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-gray-900">{selectedRequest.district}, {selectedRequest.upazila}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Donation Date</p>
                <p className="text-gray-900">{selectedRequest.donationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Donation Time</p>
                <p className="text-gray-900">{selectedRequest.donationTime}</p>
              </div>
              {selectedRequest.donor && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Donor Name</p>
                    <p className="text-gray-900">{selectedRequest.donor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Donor Email</p>
                    <p className="text-gray-900">{selectedRequest.donor.email}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.info("Edit feature coming soon");
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Edit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
