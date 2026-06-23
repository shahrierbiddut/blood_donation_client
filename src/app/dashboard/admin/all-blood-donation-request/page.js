"use client";

import { useState } from "react";
import Image from "next/image";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { requests as mockRequests } from "@/data/adminMock";
import {
  FiCalendar,
  FiClock,
  FiDroplet,
  FiEdit2,
  FiExternalLink,
  FiEye,
  FiFileText,
  FiHeart,
  FiHome,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPrinter,
  FiSave,
  FiTrash2,
  FiUpload,
  FiUser,
  FiUsers,
  FiX
} from "react-icons/fi";
import { toast } from "react-toastify";

const emptyDonor = { name: "", email: "", phone: "", avatar: "", bloodGroup: "", lastDonation: "", totalDonations: 0 };

function Avatar({ name, src, size = "h-10 w-10" }) {
  if (src) {
    return <Image src={src} alt={name || "Profile"} width={96} height={96} className={`${size} rounded-full object-cover`} unoptimized />;
  }

  return (
    <span className={`${size} flex items-center justify-center rounded-full bg-red-50 text-sm font-black text-red-600`}>
      {(name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

function Field({ label, name, value, onChange, type = "text", options }) {
  const inputClass = "mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400";

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      {options ? (
        <select name={name} value={value || ""} onChange={onChange} className={inputClass}>
          {options.map((option) => <option key={option} value={option}>{option || "None"}</option>)}
        </select>
      ) : (
        <input name={name} type={type} value={value || ""} onChange={onChange} className={inputClass} />
      )}
    </label>
  );
}

function ImageUploadField({ label, name, value, previewName, onChange, onUpload }) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <Avatar name={previewName} src={value} size="h-14 w-14" />
        <div className="min-w-0 flex-1">
          <input
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder="Paste image URL or upload"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400"
          />
        </div>
        <label className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg bg-red-600 text-white transition hover:bg-red-700" title="Upload image">
          <FiUpload size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event, name)} />
        </label>
      </div>
    </div>
  );
}

function DetailTile({ icon: Icon, label, value }) {
  return (
    <div className="flex min-h-[82px] gap-3 border-b border-r border-slate-100 p-4">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-[11px] font-bold text-slate-500">{label}</p>
        <div className="mt-1 text-sm font-semibold text-slate-900">{value || "Not provided"}</div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children, tone = "red" }) {
  const toneClass = tone === "blue" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600";
  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-slate-900">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${toneClass}`}>
        <Icon size={16} />
      </span>
      {children}
    </h3>
  );
}

function TimelineStep({ active, accent, title, subtitle }) {
  const dotClass = accent === "amber" ? "border-amber-400 bg-amber-50" : active ? "border-blue-500 bg-blue-50" : "border-slate-400 bg-slate-100";
  const innerClass = accent === "amber" ? "bg-amber-400" : active ? "bg-blue-500" : "bg-slate-400";

  return (
    <div className="relative flex flex-1 items-start gap-3">
      <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${dotClass}`}>
        <span className={`h-2 w-2 rounded-full ${innerClass}`} />
      </span>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AllBloodDonationRequestsPage() {
  const [requests, setRequests] = useState(() => (Array.isArray(mockRequests) ? mockRequests.filter(Boolean) : []));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const filteredRequests = requests.filter((r) => {
    if (!r) return false;
    const matchesSearch =
      (r.recipientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.district || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.upazila || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteRequest = (requestId) => {
    setRequests((items) => items.filter((r) => r.id !== requestId));
    if (selectedRequest?.id === requestId) setSelectedRequest(null);
    if (editingRequest?.id === requestId) setEditingRequest(null);
    toast.success("Request deleted successfully");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("donor.")) {
      const donorKey = name.replace("donor.", "");
      setEditingRequest((current) => ({
        ...current,
        donor: { ...(current.donor || emptyDonor), [donorKey]: donorKey === "totalDonations" ? Number(value) : value }
      }));
      return;
    }

    setEditingRequest((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result;
      if (fieldName.startsWith("donor.")) {
        const donorKey = fieldName.replace("donor.", "");
        setEditingRequest((current) => ({
          ...current,
          donor: { ...(current.donor || emptyDonor), [donorKey]: value }
        }));
        return;
      }
      setEditingRequest((current) => ({ ...current, [fieldName]: value }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editingRequest) return;
    const cleanedDonor = editingRequest.donor?.name ? editingRequest.donor : null;
    const nextRequest = { ...editingRequest, donor: cleanedDonor };

    setRequests((items) => items.map((item) => (item.id === nextRequest.id ? nextRequest : item)));
    setSelectedRequest(nextRequest);
    setEditingRequest(null);
    toast.success("Request updated successfully");
  };

  const openEdit = (request) => {
    if (!request) return;
    setEditingRequest({ ...request, donor: request.donor ? { ...emptyDonor, ...request.donor } : { ...emptyDonor } });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">All Blood Donation Requests</h1>
        <p className="text-gray-600 text-sm">View and manage all blood donation requests</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 gap-4">
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

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Recipient</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Blood Group</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Location</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Donor</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request, index) => (
                <tr key={request.id || `request-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={request.recipientName} src={request.recipientAvatar} />
                      <div>
                        <span className="text-sm font-bold text-gray-900">{request.recipientName || "Unnamed recipient"}</span>
                        <p className="text-xs text-slate-500">{request.hospital || "Hospital not set"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-black text-white">{request.bloodGroup}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{request.district}, {request.upazila}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{request.donationDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{request.donor?.name || "Not assigned"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedRequest(request)} className="p-2 rounded-lg text-blue-600 transition hover:bg-blue-50" title="View">
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => openEdit(request)} className="p-2 rounded-lg text-amber-600 transition hover:bg-amber-50" title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteRequest(request.id)} className="p-2 rounded-lg text-red-600 transition hover:bg-red-50" title="Delete">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600">
                  <FiFileText />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Request Details</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Request ID: #{String(selectedRequest.id || "REQ").toUpperCase()}-2026</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                <FiX size={22} />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.3fr_0.85fr_0.75fr]">
              <section className="rounded-lg border border-slate-200 p-5">
                <SectionTitle icon={FiUser}>Recipient Information</SectionTitle>
                <div className="flex items-center gap-5">
                  <Avatar name={selectedRequest.recipientName} src={selectedRequest.recipientAvatar} size="h-28 w-28" />
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{selectedRequest.recipientName}</h3>
                    <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">32 years</span>
                    <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                      <p className="flex items-center gap-2"><FiPhone className="text-slate-400" /> 01712-345678</p>
                      <p className="flex items-center gap-2"><FiMail className="text-slate-400" /> {selectedRequest.recipientEmail || "rahim.ahmed@email.com"}</p>
                      <p className="flex items-center gap-2"><FiMapPin className="text-slate-400" /> {selectedRequest.upazila}, {selectedRequest.district}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 p-5">
                <SectionTitle icon={FiDroplet}>Blood Information</SectionTitle>
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Blood Group</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-3xl font-black text-red-600">{selectedRequest.bloodGroup}</span>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">Positive</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Required Units</p>
                    <p className="mt-2 text-lg font-black text-slate-900">{selectedRequest.units || 2} Units</p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 p-5">
                <SectionTitle icon={FiFileText}>Request Image</SectionTitle>
                {selectedRequest.requestImage ? (
                  <>
                    <Image src={selectedRequest.requestImage} alt="Request document" width={320} height={170} className="h-36 w-full rounded-lg object-cover" unoptimized />
                    <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                      View Full Image <FiExternalLink size={14} />
                    </button>
                  </>
                ) : (
                  <div className="grid h-44 place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center text-sm font-semibold text-slate-400">
                    No request image uploaded
                  </div>
                )}
              </section>
            </div>

            <section className="mt-5 rounded-lg border border-slate-200 p-4">
              <SectionTitle icon={FiFileText}>Request Details</SectionTitle>
              <div className="grid overflow-hidden rounded-lg border border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
                <DetailTile icon={FiMapPin} label="Location" value={`${selectedRequest.district}, ${selectedRequest.upazila}`} />
                <DetailTile icon={FiHome} label="Hospital / Organization" value={selectedRequest.hospital} />
                <DetailTile icon={FiCalendar} label="Donation Date" value={selectedRequest.donationDate} />
                <DetailTile icon={FiClock} label="Donation Time" value={selectedRequest.donationTime} />
                <DetailTile icon={FiCalendar} label="Need Date & Time" value={`${selectedRequest.donationDate}, ${selectedRequest.donationTime}`} />
                <DetailTile icon={FiHeart} label="Request Purpose" value={selectedRequest.purpose || "Surgery"} />
                <DetailTile icon={FiInfo} label="Status" value={<StatusBadge status={selectedRequest.status} />} />
                <DetailTile icon={FiCalendar} label="Created At" value={selectedRequest.createdAt || "18 Jun 2026, 09:15 PM"} />
              </div>
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 p-5">
                <SectionTitle icon={FiInfo} tone="blue">Additional Information</SectionTitle>
                <p className="text-sm font-medium leading-6 text-slate-700">
                  {selectedRequest.message || "My father is going through a heart surgery. Doctor has advised for blood. Please anyone help us."}
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 p-5">
                <SectionTitle icon={FiUsers} tone="blue">Donor Information (Assigned)</SectionTitle>
                {selectedRequest.donor ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar name={selectedRequest.donor.name} src={selectedRequest.donor.avatar} size="h-16 w-16" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-900">{selectedRequest.donor.name}</p>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Donor</span>
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600"><FiPhone className="text-slate-400" /> {selectedRequest.donor.phone || "01712-345678"}</p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-600"><FiMail className="text-slate-400" /> {selectedRequest.donor.email}</p>
                      </div>
                    </div>
                    <button className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">View Profile</button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">No donor assigned yet.</div>
                )}
              </section>
            </div>

            <section className="mt-5 rounded-lg border border-slate-200 p-5">
              <SectionTitle icon={FiFileText}>Request Timeline</SectionTitle>
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <TimelineStep active title="Request Created" subtitle={selectedRequest.createdAt || "18 Jun 2026, 09:15 PM"} />
                <div className="hidden h-px flex-1 bg-slate-200 md:mt-3 md:block" />
                <TimelineStep accent="amber" title={`Status Updated to ${selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}`} subtitle={selectedRequest.updatedAt || "18 Jun 2026, 09:20 PM"} />
                <div className="hidden h-px flex-1 bg-slate-200 md:mt-3 md:block" />
                <TimelineStep title={selectedRequest.donor ? "Donor Assigned" : "Awaiting Donor"} subtitle={selectedRequest.donor ? selectedRequest.donor.name : "--"} />
              </div>
            </section>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <FiPrinter /> Print Details
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setSelectedRequest(null)} className="rounded-lg border border-slate-200 px-16 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                  Close
                </button>
                <button onClick={() => openEdit(selectedRequest)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-16 py-3 text-sm font-black text-white transition hover:bg-red-700">
                  <FiEdit2 /> Edit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSaveEdit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Edit Donation Request</h2>
                <p className="text-sm text-slate-500">Update recipient, request, and donor information.</p>
              </div>
              <button type="button" onClick={() => setEditingRequest(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <FiX />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <section className="space-y-4 rounded-xl border border-slate-100 p-5">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-900"><FiUser className="text-red-500" /> Recipient</h3>
                <Field label="Recipient Name" name="recipientName" value={editingRequest.recipientName} onChange={handleEditChange} />
                <ImageUploadField
                  label="Recipient Image"
                  name="recipientAvatar"
                  value={editingRequest.recipientAvatar}
                  previewName={editingRequest.recipientName}
                  onChange={handleEditChange}
                  onUpload={handleImageUpload}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Blood Group" name="bloodGroup" value={editingRequest.bloodGroup} onChange={handleEditChange} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
                  <Field label="Status" name="status" value={editingRequest.status} onChange={handleEditChange} options={["pending", "inprogress", "done", "cancelled"]} />
                </div>
                <Field label="Hospital" name="hospital" value={editingRequest.hospital} onChange={handleEditChange} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="District" name="district" value={editingRequest.district} onChange={handleEditChange} />
                  <Field label="Upazila" name="upazila" value={editingRequest.upazila} onChange={handleEditChange} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Donation Date" name="donationDate" value={editingRequest.donationDate} onChange={handleEditChange} type="date" />
                  <Field label="Donation Time" name="donationTime" value={editingRequest.donationTime} onChange={handleEditChange} type="time" />
                </div>
                <Field label="Message" name="message" value={editingRequest.message} onChange={handleEditChange} />
              </section>

              <section className="space-y-4 rounded-xl border border-slate-100 p-5">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-900"><FiDroplet className="text-red-500" /> Donor Info</h3>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <Avatar name={editingRequest.donor?.name || "Donor"} src={editingRequest.donor?.avatar} size="h-16 w-16" />
                  <div>
                    <p className="font-black text-slate-900">{editingRequest.donor?.name || "No donor assigned"}</p>
                    <p className="text-xs font-bold text-slate-500">Leave donor name empty to remove assignment.</p>
                  </div>
                </div>
                <Field label="Donor Name" name="donor.name" value={editingRequest.donor?.name} onChange={handleEditChange} />
                <ImageUploadField
                  label="Donor Image"
                  name="donor.avatar"
                  value={editingRequest.donor?.avatar}
                  previewName={editingRequest.donor?.name}
                  onChange={handleEditChange}
                  onUpload={handleImageUpload}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Donor Email" name="donor.email" value={editingRequest.donor?.email} onChange={handleEditChange} type="email" />
                  <Field label="Donor Phone" name="donor.phone" value={editingRequest.donor?.phone} onChange={handleEditChange} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Donor Blood Group" name="donor.bloodGroup" value={editingRequest.donor?.bloodGroup} onChange={handleEditChange} options={["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
                  <Field label="Total Donations" name="donor.totalDonations" value={editingRequest.donor?.totalDonations} onChange={handleEditChange} type="number" />
                </div>
                <Field label="Last Donation" name="donor.lastDonation" value={editingRequest.donor?.lastDonation} onChange={handleEditChange} type="date" />
              </section>
            </div>

            <div className="flex gap-3 border-t border-slate-100 px-6 py-5">
              <button type="button" onClick={() => setEditingRequest(null)} className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700">
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
