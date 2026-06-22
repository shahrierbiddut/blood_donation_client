"use client";

import { FiUsers, FiDollarSign, FiDroplet, FiHeart } from 'react-icons/fi';
import StatCard from '@/Components/Admin/StatCard';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { users, requests, funding } from '@/data/adminMock';

export default function AdminDashboard() {
  const stats = {
    totalUsers: users.length,
    totalFunding: funding.reduce((s, f) => s + f.amount, 0),
    totalRequests: requests.length,
    activeVolunteers: users.filter(u => u.role === 'volunteer').length
  };

  const donutData = [
    { name: 'A+', value: 28 }, { name: 'O+', value: 25 }, { name: 'B+', value: 20 }, { name: 'AB+', value: 15 }, { name: 'Others', value: 12 }
  ];
  const COLORS = ['#DC2626', '#991B1B', '#F59E0B', '#16A34A', '#94A3B8'];

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back, Admin</h2>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<FiUsers />} />
        <StatCard title="Total Funding" value={`$${stats.totalFunding}`} icon={<FiDollarSign />} />
        <StatCard title="Blood Donation Requests" value={stats.totalRequests} icon={<FiDroplet />} />
        <StatCard title="Active Volunteers" value={stats.activeVolunteers} icon={<FiHeart />} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Donation Requests</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{month:'Jan', value:10},{month:'Feb', value:20},{month:'Mar', value:30},{month:'Apr', value:28}]}> 
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Blood Group Distribution</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Funding Growth</h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{month:'Jan', a:400},{month:'Feb', a:600},{month:'Mar', a:800}]}> 
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="a" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
