"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";

const donors = [
  { id: 1, name: "Hasib Araf", bloodGroup: "O+", district: "Dhaka", availability: "Available", lastDonation: "2026-04-02" },
  { id: 2, name: "Muntaha Saba", bloodGroup: "A-", district: "Chattogram", availability: "Available", lastDonation: "2026-03-18" },
  { id: 3, name: "Tahsin Noor", bloodGroup: "B+", district: "Sylhet", availability: "Busy", lastDonation: "2026-05-11" },
  { id: 4, name: "Rifat Karim", bloodGroup: "O-", district: "Rajshahi", availability: "Available", lastDonation: "2026-02-27" },
  { id: 5, name: "Sumaiya Rahman", bloodGroup: "AB+", district: "Dhaka", availability: "Available", lastDonation: "2026-01-22" }
];

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchDonorsPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const filtered = useMemo(() => {
    return donors.filter((donor) => {
      const byGroup = group === "All" ? true : donor.bloodGroup === group;
      const q = query.toLowerCase();
      const byQuery = donor.name.toLowerCase().includes(q) || donor.district.toLowerCase().includes(q);
      return byGroup && byQuery;
    });
  }, [group, query]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white py-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-slate-900">Search Donors</h1>
            <p className="mt-2 text-slate-600">Find verified donors by blood group and location.</p>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                placeholder="Search by donor name or district"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
            <div className="mb-4 text-sm font-medium text-slate-500">Matched {filtered.length} donor(s)</div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((donor) => (
                <article key={donor.id} className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{donor.bloodGroup}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        donor.availability === "Available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {donor.availability}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{donor.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">District: {donor.district}</p>
                  <p className="mt-1 text-sm text-slate-600">Last donation: {donor.lastDonation}</p>

                  <div className="mt-5 flex gap-2">
                    <Button className="flex-1 bg-red-600 text-white">Request</Button>
                    <Button className="flex-1 border border-red-300 bg-white text-red-600">Profile</Button>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-red-200 bg-white p-8 text-center text-slate-500">
                No donor found with current filters.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
