"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { requests as mockRequests } from "@/data/adminMock";
import { FiCalendar, FiCheckCircle, FiClock, FiDroplet, FiEdit2, FiEye, FiMapPin, FiSearch, FiTrash2, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const extraDonations = [
  {
    id: "d9",
    recipientName: "Mariam Akter",
    recipientAvatar: "https://i.pravatar.cc/120?img=32",
    bloodGroup: "B+",
    district: "Chattogram",
    upazila: "Agrabad",
    hospital: "Chattogram Medical College Hospital",
    donationDate: "2026-05-24",
    donationTime: "14:30",
    status: "inprogress",
    donor: { name: "Tahmina Akter", avatar: "https://i.pravatar.cc/120?img=47", email: "tahmina@email.com" }
  },
  {
    id: "d10",
    recipientName: "Sadia Islam",
    recipientAvatar: "https://i.pravatar.cc/120?img=45",
    bloodGroup: "AB+",
    district: "Sylhet",
    upazila: "Zindabazar",
    hospital: "Sylhet MAG Osmani Medical College",
    donationDate: "2026-05-22",
    donationTime: "09:45",
    status: "cancelled",
    donor: { name: "Nusrat Jahan", avatar: "https://i.pravatar.cc/120?img=35", email: "nusrat@email.com" }
  }
];

const STATUS_STORAGE_KEY = "blood_donation_admin_status_overrides";

const applyStatusOverrides = (items) => {
  if (typeof window === "undefined") return items;
  try {
    const overrides = JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || "{}");
    return items.map((item) => ({ ...item, status: overrides[item.id] || item.status }));
  } catch {
    return items;
  }
};

function MetricCard({ icon: Icon, label, value, tone }) {
  const toneClass = {
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-50 text-slate-600"
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${toneClass}`}>
          <Icon size={24} />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, src }) {
  if (src) {
    return <Image src={src} alt={name || "Profile"} width={42} height={42} className="h-10 w-10 rounded-full object-cover" unoptimized />;
  }

  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-sm font-black text-red-600">
      {(name || "D").charAt(0).toUpperCase()}
    </span>
  );
}

export default function AllDonationsPage() {
  const [donations, setDonations] = useState(() => applyStatusOverrides([...mockRequests, ...extraDonations]));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState(null);

  const filteredDonations = useMemo(() => donations.filter((donation) => {
    const text = `${donation.recipientName} ${donation.bloodGroup} ${donation.district} ${donation.hospital} ${donation.donor?.name || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus = status === "all" || donation.status === status;
    return matchesSearch && matchesStatus;
  }), [donations, search, status]);

  const completed = donations.filter((item) => item.status === "done").length;
  const inProgress = donations.filter((item) => item.status === "inprogress").length;
  const cancelled = donations.filter((item) => item.status === "cancelled").length;

  const handleDelete = (id) => {
    setDonations((items) => items.filter((item) => item.id !== id));
    toast.success("Donation record deleted");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">All Donations</h1>
        <p className="text-gray-600 text-sm">View all blood donations in the system</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard icon={FiDroplet} label="Total Donations" value={donations.length} tone="red" />
        <MetricCard icon={FiCheckCircle} label="Completed" value={completed} tone="green" />
        <MetricCard icon={FiClock} label="In Progress" value={inProgress} tone="amber" />
        <MetricCard icon={FiXCircle} label="Cancelled" value={cancelled} tone="slate" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-end">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-red-400">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600">
            <FiCalendar className="text-slate-400" />
            01 May 2026 - 31 May 2026
          </label>
          <label className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search donation..." className="h-10 w-full rounded-lg border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-red-400 lg:w-72" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Recipient Name</th>
                <th className="px-5 py-3">Blood Group</th>
                <th className="px-5 py-3">District</th>
                <th className="px-5 py-3">Hospital / Location</th>
                <th className="px-5 py-3">Request Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Donor</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.map((donation, index) => (
                <tr key={donation.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{index + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={donation.recipientName} src={donation.recipientAvatar} />
                      <span className="text-sm font-bold text-slate-900">{donation.recipientName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-black text-red-600">{donation.bloodGroup}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{donation.district}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{donation.hospital}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{donation.donationDate}, {donation.donationTime}</td>
                  <td className="px-5 py-4"><StatusBadge status={donation.status} /></td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{donation.donor?.name || "Not assigned"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedDonation(donation)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="View"><FiEye /></button>
                      <Link href={`/dashboard/admin/all-donations/${donation.id}`} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Edit donation"><FiEdit2 /></Link>
                      <button onClick={() => handleDelete(donation.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
          <p>Showing 1 to {filteredDonations.length} of {donations.length} entries</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1">‹</button>
            <button className="rounded-lg bg-red-600 px-3 py-1 font-bold text-white">1</button>
            <button className="rounded-lg border border-slate-200 px-3 py-1">2</button>
            <button className="rounded-lg border border-slate-200 px-3 py-1">3</button>
            <button className="rounded-lg border border-slate-200 px-3 py-1">›</button>
          </div>
        </div>
      </div>

      {selectedDonation ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedDonation.recipientName}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500"><FiMapPin /> {selectedDonation.upazila}, {selectedDonation.district}</p>
              </div>
              <StatusBadge status={selectedDonation.status} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Blood Group</p><p className="mt-1 text-2xl font-black text-red-600">{selectedDonation.bloodGroup}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Hospital</p><p className="mt-1 text-sm font-bold text-slate-800">{selectedDonation.hospital}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Date & Time</p><p className="mt-1 text-sm font-bold text-slate-800">{selectedDonation.donationDate}, {selectedDonation.donationTime}</p></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Donor</p><p className="mt-1 text-sm font-bold text-slate-800">{selectedDonation.donor?.name || "Not assigned"}</p></div>
            </div>
            <button onClick={() => setSelectedDonation(null)} className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700">Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
