"use client";

import DataTable from '@/Components/Admin/DataTable';
import { funding } from '@/data/adminMock';

export default function FundingPage() {
  const columns = [
    { key: 'donorName', title: 'Donor Name', render: r => r.donorName },
    { key: 'email', title: 'Email' },
    { key: 'amount', title: 'Amount', render: r => `$${r.amount}` },
    { key: 'tx', title: 'Transaction ID' },
    { key: 'date', title: 'Date' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-4">Funding Management</h1>
      <DataTable columns={columns} data={funding} />
    </div>
  );
}
