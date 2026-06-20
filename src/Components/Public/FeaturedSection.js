import Link from "next/link";
import { Button } from "@heroui/react";

const featuredRequests = [
  {
    id: "REQ-0101",
    bloodGroup: "O+",
    hospital: "Square Hospital",
    location: "Dhaka, Panthapath",
    time: "Within 4 hours",
    status: "Urgent"
  },
  {
    id: "REQ-0102",
    bloodGroup: "A-",
    hospital: "CMH",
    location: "Dhaka Cantonment",
    time: "Today 8:00 PM",
    status: "Priority"
  },
  {
    id: "REQ-0103",
    bloodGroup: "B+",
    hospital: "Chittagong Medical",
    location: "Chattogram",
    time: "Tomorrow morning",
    status: "Open"
  }
];

export default function FeaturedSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Requests</h2>
            <p className="mt-2 text-slate-600">High priority requests that need immediate donor response.</p>
          </div>
          <Link href="/donation-requests">
            <Button variant="bordered" className="border-red-300 text-red-600">View All Requests</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredRequests.map((item) => (
            <article key={item.id} className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{item.bloodGroup}</span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">{item.status}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{item.hospital}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.location}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">Needed: {item.time}</p>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-red-600 text-white">Respond</Button>
                <Link href="/donation-requests" className="flex-1">
                  <Button className="w-full border border-red-300 bg-white text-red-600">Details</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
