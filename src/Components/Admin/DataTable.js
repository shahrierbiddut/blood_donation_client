"use client";

export default function DataTable({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-left font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400 font-semibold">No records found</td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id || row.id || idx} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 align-top text-slate-700">{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
