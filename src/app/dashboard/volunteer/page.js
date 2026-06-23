"use client";

import StatCard from "@/Components/Admin/StatCard";
import ProtectedRoute from "@/Components/ProtectedRoute";
import VolunteerSidebar from "@/Components/Shared/VolunteerSidebar";
import { requests } from "@/data/adminMock";
import { FiDroplet, FiFilter, FiClock, FiCheckCircle } from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

// Volunteer-specific stats data
const requestStatusData = [
  { status: "Pending", count: 45, color: "#F59E0B" },
  { status: "In Progress", count: 28, color: "#3B82F6" },
  { status: "Completed", count: 175, color: "#10B981" },
];

const monthlyVolunteerData = [
  { name: "Jan", helped: 8 },
  { name: "Feb", helped: 14 },
  { name: "Mar", helped: 28 },
  { name: "Apr", helped: 25 },
];

const recentRequests = requests.slice(0, 5);

function RequestStatusChart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Request Status Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={requestStatusData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis dataKey="status" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ 
              borderRadius: 12, 
              border: "1px solid #E5E7EB",
              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              backgroundColor: "#FFFFFF"
            }}
          />
          <Bar dataKey="count" radius={[10, 10, 4, 4]} barSize={48}>
            {requestStatusData.map((item, idx) => (
              <Cell key={idx} fill={item.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function VolunteerContributionChart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Monthly Contributions</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyVolunteerData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorHelped" x1="0" y1="0" x2="0" y2="1">
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
          <Line 
            type="monotone" 
            dataKey="helped" 
            stroke="#DC2626" 
            strokeWidth={3}
            dot={{ fill: "#DC2626", r: 5 }} 
            activeDot={{ r: 7 }}
            fill="url(#colorHelped)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardContent() {
  const totalRequests = 248;
  const pendingRequests = 45;
  const inProgressRequests = 28;
  const completedRequests = 175;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Welcome Back, Volunteer 👋
          </h1>
          <p className="text-gray-500 mt-2 font-semibold">
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats Cards - Volunteer Specific */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Requests"
            value={totalRequests}
            icon={<FiDroplet size={24} />}
            delta="+12% from last month"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests}
            icon={<FiFilter size={24} />}
            delta="Waiting for volunteers"
          />
          <StatCard
            title="In Progress"
            value={inProgressRequests}
            icon={<FiClock size={24} />}
            delta="Being processed"
          />
          <StatCard
            title="Completed"
            value={completedRequests}
            icon={<FiCheckCircle size={24} />}
            delta="+15 this month"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RequestStatusChart />
          <VolunteerContributionChart />
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
                  <tr 
                    key={request.id} 
                    className={`border-b border-gray-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                  >
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
    </div>
  );
}

export default function VolunteerDashboard() {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className="flex bg-gray-50 min-h-screen">
        <VolunteerSidebar />
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}
