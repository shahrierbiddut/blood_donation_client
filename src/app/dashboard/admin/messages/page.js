"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "@/Components/ProtectedRoute";
import contactService from "@/services/contactService";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [page, statusFilter, searchTerm]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAll({
        page,
        limit,
        status: statusFilter === "all" ? "" : statusFilter,
        search: searchTerm
      });

      setMessages(response.data || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to load messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await contactService.updateStatus(messageId, {
        status: newStatus
      });
      toast.success(`Status updated to ${newStatus}`);
      fetchMessages();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const handleReplyClick = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || "");
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      setReplyLoading(true);
      await contactService.updateStatus(selectedMessage._id, {
        status: "replied",
        reply: replyText
      });
      toast.success("Reply sent successfully");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      toast.error("Failed to send reply");
      console.error(err);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await contactService.delete(messageId);
      toast.success("Message deleted");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to delete message");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "replied":
        return "bg-green-50 text-green-700 border-green-200";
      case "closed":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return "🔔";
      case "replied":
        return "✅";
      case "closed":
        return "🔒";
      default:
        return "•";
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>
            <p className="mt-2 text-slate-600">Manage and respond to user inquiries</p>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              >
                <option value="all">All Messages</option>
                <option value="new">New (🔔)</option>
                <option value="replied">Replied (✅)</option>
                <option value="closed">Closed (🔒)</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search by Email/Name</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
          </div>

          {/* Messages Table */}
          {loading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">From</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Subject</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-3 text-center font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg._id} className="border-t border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{msg.name}</p>
                          <p className="text-xs text-slate-500">{msg.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="truncate text-slate-700">{msg.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                            msg.status
                          )}`}
                        >
                          {getStatusIcon(msg.status)} {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMessage(msg);
                              setShowReplyModal(true);
                            }}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                          >
                            View
                          </button>
                          {msg.status !== "replied" && (
                            <button
                              onClick={() => handleReplyClick(msg)}
                              className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition"
                            >
                              Reply
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedMessage(null);
                    setReplyText("");
                  }}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 px-6 py-4 max-h-96 overflow-y-auto">
                {/* From */}
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">From</p>
                  <p className="mt-1 text-slate-900">{selectedMessage.name}</p>
                  <p className="text-sm text-slate-600">{selectedMessage.email}</p>
                </div>

                {/* Subject */}
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Subject</p>
                  <p className="mt-1 text-slate-900">{selectedMessage.subject}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {["new", "replied", "closed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedMessage._id, status)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          selectedMessage.status === status
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {getStatusIcon(status)} {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Message</p>
                  <div className="mt-2 rounded-lg bg-slate-50 p-4 text-slate-700">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Existing Reply */}
                {selectedMessage.reply && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Your Reply</p>
                    <div className="mt-2 rounded-lg bg-green-50 p-4 text-slate-700">
                      {selectedMessage.reply}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Sent at {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Reply Input */}
                {selectedMessage.status !== "closed" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      placeholder="Type your reply here..."
                      disabled={replyLoading}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 flex justify-end gap-3 px-6 py-4 bg-slate-50">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedMessage(null);
                    setReplyText("");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
                >
                  Close
                </button>
                {selectedMessage.status !== "closed" && (
                  <button
                    onClick={handleSendReply}
                    disabled={replyLoading || !replyText.trim()}
                    className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition"
                  >
                    {replyLoading ? "Sending..." : "Send Reply"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
