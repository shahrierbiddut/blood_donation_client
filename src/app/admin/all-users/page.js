"use client";

import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { users } from '@/data/adminMock';

export default function AllUsersPage() {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'bloodGroup', title: 'Blood Group' },
    { key: 'role', title: 'Role' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', title: 'Created Date' },
    { key: 'actions', title: 'Actions', render: (r) => <div className="text-sm text-slate-500">•••</div> }
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-4">All Users</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 pr-4">
          <input placeholder="Search by name or email" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
