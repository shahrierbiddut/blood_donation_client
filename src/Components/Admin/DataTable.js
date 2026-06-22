"use client";

export default function DataTable({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
      <table className="w-full table-auto text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left">{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-400">No records found</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top text-slate-700">{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
