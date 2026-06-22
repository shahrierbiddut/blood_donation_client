"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { users as mockUsers } from "@/data/adminMock";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { FiCrown, FiEye, FiMoreVertical, FiSearch, FiShield, FiTrash2, FiUserCheck, FiUsers, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";

function Avatar({ user }) {
  return <Image src={user.avatar} alt={user.name} width={42} height={42} className="h-10 w-10 rounded-full object-cover" unoptimized />;
}

function Metric({ icon: Icon, label, value, tone }) {
  const toneClass = { red: "bg-red-50 text-red-600", blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600" }[tone];
  return <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-xl ${toneClass}`}><Icon size={22} /></span><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900">{value}</p></div></div></div>;
}

export default function ManageAdminsPage() {
  const initialAdmins = mockUsers.filter((user) => user.role === "admin").concat([
    { id: "a2", name: "Mizanur Rahman", email: "mizanur.admin@email.com", phone: "+880 1811-223344", role: "admin", status: "active", createdAt: "12 May, 2025", avatar: "https://i.pravatar.cc/120?img=14", bloodGroup: "B+" },
    { id: "a3", name: "Nusrat Jahan", email: "nusrat.admin@email.com", phone: "+880 1911-334455", role: "admin", status: "blocked", createdAt: "14 May, 2025", avatar: "https://i.pravatar.cc/120?img=35", bloodGroup: "AB+" }
  ]);
  const [admins, setAdmins] = useState(initialAdmins);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const filteredAdmins = useMemo(() => admins.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(search.toLowerCase()) || admin.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || admin.status === status;
    return matchesSearch && matchesStatus;
  }), [admins, search, status]);

  const toggleBlock = (id) => {
    setAdmins((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "blocked" ? "active" : "blocked" } : item));
    setActiveMenu(null);
    toast.success("Admin status updated");
  };

  const removeAdmin = (id) => {
    setAdmins((items) => items.filter((item) => item.id !== id));
    setActiveMenu(null);
    toast.success("Admin removed");
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-3xl font-bold text-slate-900 mb-1">Manage Admins</h1><p className="text-gray-600 text-sm">Dashboard / Manage Admins</p></div>
      <div className="mb-6 grid gap-4 md:grid-cols-3"><Metric icon={FiShield} label="Total Admins" value={admins.length} tone="red" /><Metric icon={FiCrown} label="Super Admins" value="1" tone="blue" /><Metric icon={FiUserCheck} label="Active Admins" value={admins.filter((a) => a.status === "active").length} tone="green" /></div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-end"><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-red-400"><option value="all">All Status</option><option value="active">Active</option><option value="blocked">Blocked</option></select><label className="relative"><FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search admin..." className="h-10 w-full rounded-lg border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-red-400 lg:w-72" /></label></div>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">#</th><th className="px-5 py-3">Admin</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Join Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredAdmins.map((admin, index) => (<tr key={admin.id} className="hover:bg-slate-50"><td className="px-5 py-4 text-sm font-semibold text-slate-600">{index + 1}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar user={admin} /><span className="text-sm font-bold text-slate-900">{admin.name}</span></div></td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{admin.email}</td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{admin.phone}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${index === 0 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{index === 0 ? "Super Admin" : "Admin"}</span></td><td className="px-5 py-4 text-sm font-semibold text-slate-600">{admin.createdAt}</td><td className="px-5 py-4"><StatusBadge status={admin.status} /></td><td className="relative px-5 py-4"><button onClick={() => setActiveMenu(activeMenu === admin.id ? null : admin.id)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><FiMoreVertical /></button>{activeMenu === admin.id ? (<div className="absolute right-6 top-12 z-10 w-52 rounded-lg border border-slate-200 bg-white py-2 shadow-xl"><button onClick={() => { setSelectedAdmin(admin); setActiveMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiEye /> View Details</button><button onClick={() => toggleBlock(admin.id)} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><FiXCircle /> {admin.status === "blocked" ? "Restore Admin" : "Block Admin"}</button><button onClick={() => toast.info("Ownership transfer demo action") } className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"><FiUsers /> Transfer Ownership</button><button onClick={() => removeAdmin(admin.id)} className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiTrash2 /> Remove Admin</button></div>) : null}</td></tr>))}</tbody></table></div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500"><p>Showing 1 to {filteredAdmins.length} of {admins.length} entries</p><div className="flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-1">‹</button><button className="rounded-lg bg-red-600 px-3 py-1 font-bold text-white">1</button><button className="rounded-lg border border-slate-200 px-3 py-1">2</button><button className="rounded-lg border border-slate-200 px-3 py-1">›</button></div></div>
      </div>
      {selectedAdmin ? (<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center gap-4"><Avatar user={selectedAdmin} /><div><h2 className="text-xl font-black text-slate-900">{selectedAdmin.name}</h2><p className="text-sm font-semibold text-slate-500">{selectedAdmin.email}</p></div></div><div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700"><p>Phone: {selectedAdmin.phone}</p><p>Blood Group: {selectedAdmin.bloodGroup}</p><p>Joined: {selectedAdmin.createdAt}</p><p>Status: {selectedAdmin.status}</p></div><button onClick={() => setSelectedAdmin(null)} className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700">Close</button></div></div>) : null}
    </div>
  );
}
