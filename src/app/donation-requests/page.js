"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";

const requests = [
  { id: "REQ-2101", patient: "Sadia Rahman", bloodGroup: "O+", district: "Dhaka", hospital: "United Hospital", date: "2026-06-23", status: "Urgent" },
  { id: "REQ-2102", patient: "Ayan Karim", bloodGroup: "A-", district: "Chattogram", hospital: "Chittagong Medical", date: "2026-06-24", status: "Open" },
  { id: "REQ-2103", patient: "Tahmid Islam", bloodGroup: "B+", district: "Dhaka", hospital: "Square Hospital", date: "2026-06-25", status: "Priority" },
  { id: "REQ-2104", patient: "Nusrat Jahan", bloodGroup: "AB+", district: "Rajshahi", hospital: "Rajshahi Medical", date: "2026-06-26", status: "Open" },
  { id: "REQ-2105", patient: "Mehedi Hasan", bloodGroup: "O-", district: "Sylhet", hospital: "Sylhet MAG", date: "2026-06-22", status: "Urgent" },
  { id: "REQ-2106", patient: "Rafiul Alam", bloodGroup: "A+", district: "Khulna", hospital: "City Medical", date: "2026-06-27", status: "Open" }
];

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonationRequestsPage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const byGroup = group === "All" ? true : item.bloodGroup === group;
      const q = search.toLowerCase();
      const bySearch =
        item.patient.toLowerCase().includes(q) ||
        item.hospital.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q);
      return byGroup && bySearch;
    });
  }, [group, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-red-100 bg-white py-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-slate-900">Blood Donation Requests</h1>
            <p className="mt-2 text-slate-600">Find and respond to urgent blood requests in your area.</p>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                placeholder="Search by patient, hospital, district"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:col-span-2"
              />
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
              >
                {bloodGroups.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-sm font-medium text-slate-500">Showing {filtered.length} request(s)</div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <article key={item.id} className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{item.bloodGroup}</span>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">{item.status}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.patient}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.hospital}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.district}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">Donation Date: {item.date}</p>

                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1 bg-red-600 text-white">Respond</Button>
                    <Button className="flex-1 border border-red-300 bg-white text-red-600">Details</Button>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-red-200 bg-white p-8 text-center text-slate-500">
                No requests found for current filters.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
