"use client";

import StatCard from "@/Components/Admin/StatCard";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { users, requests, funding } from "@/data/adminMock";
import { FiUsers, FiDollarSign, FiDroplet, FiHeart, FiTrendingUp } from "react-icons/fi";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const monthlyData = [
  { name: "Jan", requests: 8, donors: 12 },
  { name: "Feb", requests: 14, donors: 18 },
  { name: "Mar", requests: 28, donors: 32 },
  { name: "Apr", requests: 25, donors: 28 },
];

const bloodGroupData = [
  { name: "A+", value: 28, color: "#EF4444" },
  { name: "O-", value: 25, color: "#06B6D4" },
  { name: "B+", value: 20, color: "#F97316" },
  { name: "AB+", value: 15, color: "#8B5CF6" },
  { name: "Others", value: 12, color: "#6366F1" },
];

const fundingData = [
  { month: "Jan", amount: 1200, donors: 24, color: "#DC2626" },
  { month: "Feb", amount: 1900, donors: 38, color: "#EA580C" },
  { month: "Mar", amount: 1600, donors: 31, color: "#F59E0B" },
  { month: "Apr", amount: 2100, donors: 42, color: "#10B981" },
  { month: "May", amount: 2450, donors: 49, color: "#0891B2" },
  { month: "Jun", amount: 2250, donors: 45, color: "#0F172A" },
];

const recentRequests = requests.slice(0, 5);

function BloodGroupDistribution() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Blood Group Distribution</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] items-center gap-4">
        <div className="h-[245px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bloodGroupData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={96}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
                dataKey="value"
              >
                {bloodGroupData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  backgroundColor: "#FFFFFF"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {bloodGroupData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition-colors">
              <span className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="text-slate-500 font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FundingGrowthChart() {
  const total = fundingData.reduce((sum, item) => sum + item.amount, 0);
  const topMonth = fundingData.reduce((best, item) => (item.amount > best.amount ? item : best), fundingData[0]);
  const average = Math.round(total / fundingData.length);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Funding Growth</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Monthly donor funding performance and campaign momentum.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50 px-4 py-3 border border-red-100">
            <p className="text-[11px] font-bold uppercase text-red-600">Total Raised</p>
            <p className="mt-1 text-lg font-black text-slate-900">${total.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 px-4 py-3 border border-emerald-100">
            <p className="text-[11px] font-bold uppercase text-emerald-600">Best Month</p>
            <p className="mt-1 text-lg font-black text-slate-900">{topMonth.month}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-3 border border-blue-100">
            <p className="text-[11px] font-bold uppercase text-blue-600">Avg/Month</p>
            <p className="mt-1 text-lg font-black text-slate-900">${average.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_210px]">
        <div className="h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fundingData} margin={{ top: 16, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {fundingData.map((item, idx) => (
                  <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                formatter={(value, name) => [name === "amount" ? `$${value}` : value, name === "amount" ? "Funding" : "Donors"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 16px 30px rgba(15,23,42,0.12)", backgroundColor: "#FFFFFF" }}
              />
              <Bar dataKey="amount" radius={[10, 10, 4, 4]} barSize={48}>
                {fundingData.map((item, idx) => (
                  <Cell key={item.month} fill={`url(#gradient-${idx})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-emerald-600 shadow-md border border-emerald-100">
              <FiTrendingUp />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900">Monthly Split</p>
              <p className="text-xs font-semibold text-slate-500">Color by month</p>
            </div>
          </div>
          <div className="space-y-3">
            {fundingData.map((item) => (
              <div key={item.month} className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-2 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  {item.month}
                </span>
                <span className="text-sm font-black text-slate-900">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const activeVolunteers = users.filter((u) => u.role === "volunteer" && u.status === "active").length;
  const totalFunding = funding.reduce((sum, f) => sum + f.amount, 0);

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
      {/* Welcome Section */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Welcome Back, Admin 👋</h1>
        <p className="text-gray-500 mt-2 font-semibold">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<FiUsers size={24} />}
          delta="+12% from last month"
        />
        <StatCard
          title="Total Funding"
          value={`$${totalFunding}`}
          icon={<FiDollarSign size={24} />}
          delta="+8% from last month"
        />
        <StatCard
          title="Blood Donation Requests"
          value={requests.length}
          icon={<FiDroplet size={24} />}
          delta={`${requests.filter((r) => r.status === "pending").length} pending`}
        />
        <StatCard
          title="Active Volunteers"
          value={activeVolunteers}
          icon={<FiHeart size={24} />}
          delta="+5 this month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Donations Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Donation Requests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  backgroundColor: "#FFFFFF"
                }}
                cursor={{ strokeDasharray: "4 4", stroke: "#DC2626" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#DC2626" 
                strokeWidth={3}
                dot={{ fill: "#DC2626", r: 5 }} 
                activeDot={{ r: 7 }}
                fill="url(#colorRequests)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <BloodGroupDistribution />
      </div>

      {/* Funding Growth Chart */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <FundingGrowthChart />
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Blood Donation Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request, idx) => (
                <tr key={request.id} className={`border-b border-gray-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{request.recipientName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600 bg-red-50/30 rounded px-2 py-1 w-fit">{request.bloodGroup}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.donationDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        request.status === "pending"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : request.status === "inprogress"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : request.status === "done"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
