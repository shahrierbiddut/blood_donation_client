"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { users as mockUsers } from "@/data/adminMock";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { FiCheckCircle, FiEye, FiMoreVertical, FiSearch, FiSlash, FiTrash2, FiUsers, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";

function MetricCard({ icon: Icon, label, value, tone }) {
  const toneClass = { red: "bg-red-50 text-red-600", green: "bg-emerald-50 text-emerald-600", slate: "bg-slate-50 text-slate-600" }[tone];
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${toneClass}`}><Icon size={22} /></span>
        <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900">{value}</p></div>
      </div>
    </div>
  );
}

function Avatar({ user }) {
  return <Image src={user.avatar} alt={user.name} width={42} height={42} className="h-10 w-10 rounded-full object-cover" unoptimized />;
}

export default function ManageVolunteersPage() {
  const [volunteers, setVolunteers] = useState(() => mockUsers.filter((user) => user.role === "volunteer"));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const filteredVolunteers = useMemo(() => volunteers.filter((volunteer) => {
    const matchesSearch = volunteer.name.toLowerCase().includes(search.toLowerCase()) || volunteer.email.toLowerCase().includes(search.toLowerCase()) || volunteer.phone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || volunteer.status === status;
    return matchesSearch && matchesStatus;
  }), [search, status, volunteers]);

  const activeCount = volunteers.filter((volunteer) => volunteer.status === "active").length;
  const blockedCount = volunteers.filter((volunteer) => volunteer.status === "blocked").length;

  const handleBlock = (id) => {
    setVolunteers((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "blocked" ? "active" : "blocked" } : item));
    setActiveMenu(null);
    toast.success("Volunteer status updated");
  };

  const handleRemove = (id) => {
    setVolunteers((items) => items.filter((item) => item.id !== id));
    setActiveMenu(null);
    toast.success("Volunteer removed from the team");
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-3xl font-bold text-slate-900 mb-1">Manage Volunteers</h1><p className="text-gray-600 text-sm">Dashboard / Manage Volunteers</p></div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard icon={FiUsers} label="Total Volunteers" value={volunteers.length} tone="red" />
        <MetricCard icon={FiCheckCircle} label="Active Volunteers" value={activeCount} tone="green" />
        <MetricCard icon={FiXCircle} label="Blocked Volunteers" value={blockedCount} tone="slate" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-end">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-red-400"><option value="all">All Status</option><option value="active">Active</option><option value="blocked">Blocked</option></select>
          <label className="relative"><FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search volunteer..." className="h-10 w-full rounded-lg border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-red-400 lg:w-72" /></label>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">#</th><th className="px-5 py-3">Volunteer</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">District</th><th className="px-5 py-3">Join Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
          {filteredVolunteers.map((volunteer, index) => (<tr key={volunteer.id} className="hover:bg-slate-50"><td className="px-5 py-4 text-sm font-semibold text-slate-600">{index + 1}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar user={volunteer} /><span className="text-sm font-bold text-slate-900">{volunteer.name}</span></div></td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{volunteer.email}</td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{volunteer.phone}</td><td className="px-5 py-4 text-sm font-semibold text-slate-600">Dhaka</td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{volunteer.createdAt}</td><td className="px-5 py-4"><StatusBadge status={volunteer.status} /></td><td className="relative px-5 py-4"><button onClick={() => setActiveMenu(activeMenu === volunteer.id ? null : volunteer.id)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><FiMoreVertical /></button>{activeMenu === volunteer.id ? (<div className="absolute right-6 top-12 z-10 w-52 rounded-lg border border-slate-200 bg-white py-2 shadow-xl"><button onClick={() => { setSelectedVolunteer(volunteer); setActiveMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiEye /> View Details</button><button onClick={() => handleBlock(volunteer.id)} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><FiSlash /> {volunteer.status === "blocked" ? "Unblock" : "Block"}</button><button onClick={() => handleRemove(volunteer.id)} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiTrash2 /> Remove from Volunteer</button></div>) : null}</td></tr>))}
        </tbody></table></div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500"><p>Showing 1 to {filteredVolunteers.length} of {volunteers.length} entries</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-1">‹</button><button className="rounded-lg bg-red-600 px-3 py-1 font-bold text-white">1</button><button className="rounded-lg border border-slate-200 px-3 py-1">2</button><button className="rounded-lg border border-slate-200 px-3 py-1">›</button></div></div>
      </div>
      {selectedVolunteer ? (<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center gap-4"><Avatar user={selectedVolunteer} /><div><h2 className="text-xl font-black text-slate-900">{selectedVolunteer.name}</h2><p className="text-sm font-semibold text-slate-500">{selectedVolunteer.email}</p></div></div><div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700"><p>Phone: {selectedVolunteer.phone}</p><p>Blood Group: {selectedVolunteer.bloodGroup}</p><p>Joined: {selectedVolunteer.createdAt}</p><p>Status: {selectedVolunteer.status}</p></div><button onClick={() => setSelectedVolunteer(null)} className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700">Close</button></div></div>) : null}
    </div>
  );
}
