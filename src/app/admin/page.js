"use client";

import StatCard from "@/Components/Admin/StatCard";
import { users, requests, funding } from "@/data/adminMock";
import { FiUsers, FiDollarSign, FiDroplet, FiHeart } from "react-icons/fi";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const monthlyData = [
  { name: "Jan", requests: 8, donors: 12 },
  { name: "Feb", requests: 14, donors: 18 },
  { name: "Mar", requests: 28, donors: 32 },
  { name: "Apr", requests: 25, donors: 28 },
];

const bloodGroupData = [
  { name: "A+", value: 28, color: "#DC2626" },
  { name: "O-", value: 25, color: "#A9B8D8" },
  { name: "B+", value: 20, color: "#F9734D" },
  { name: "AB+", value: 15, color: "#667085" },
  { name: "Others", value: 12, color: "#17233D" },
];

const fundingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1900 },
  { month: "Mar", amount: 1600 },
  { month: "Apr", amount: 2100 },
];

const recentRequests = requests.slice(0, 5);

function BloodGroupDistribution() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                paddingAngle={0}
                stroke="#ffffff"
                strokeWidth={2}
                dataKey="value"
              >
                {bloodGroupData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          {bloodGroupData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-5 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="text-slate-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const activeVolunteers = users.filter((u) => u.role === "volunteer" && u.status === "active").length;
  const totalFunding = funding.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900">Welcome Back, Admin 👋</h1>
        <p className="text-gray-600 mt-2">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Donation Requests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <BloodGroupDistribution />
      </div>

      {/* Funding Growth Chart */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Funding Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fundingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#DC2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Blood Donation Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Recipient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.recipientName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600">{request.bloodGroup}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.donationDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "inprogress"
                          ? "bg-blue-100 text-blue-700"
                          : request.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
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
  );
}
