"use client";

import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import { requests } from '@/data/adminMock';

export default function AllRequestsPage() {
  const columns = [
    { key: 'recipientName', title: 'Recipient Name' },
    { key: 'bloodGroup', title: 'Blood Group' },
    { key: 'district', title: 'District' },
    { key: 'upazila', title: 'Upazila' },
    { key: 'donationDate', title: 'Donation Date' },
    { key: 'donationTime', title: 'Donation Time' },
    { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'donor', title: 'Donor', render: (r) => r.donor ? `${r.donor.name} (${r.donor.email})` : '-' },
    { key: 'actions', title: 'Actions', render: (r) => <div className="text-sm text-slate-500">•••</div> }
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-4">All Blood Donation Requests</h1>
      <DataTable columns={columns} data={requests} />
    </div>
  );
}
