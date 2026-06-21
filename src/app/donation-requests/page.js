"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMapPin, FiClock, FiCalendar, FiChevronLeft, FiChevronRight, FiSearch, FiDroplet } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import donationService from "@/services/donationService";
import mockDonationRequests from "@/data/mockDonationRequests";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STATUS_STYLE = {
  pending: "bg-slate-100 text-slate-600",
  inprogress: "bg-orange-100 text-orange-700",
  done: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600"
};
const STATUS_LABEL = { pending: "Pending", inprogress: "In Progress", done: "Done", cancelled: "Cancelled" };
const PAGE_SIZE = 12;

const filterRequests = (items, filters) => items.filter((item) => {
  const bloodMatch = filters.bloodGroup === "All" || item.bloodGroup === filters.bloodGroup;
  const districtMatch = filters.district === "All" || item.district?.toLowerCase().includes(filters.district.toLowerCase());
  const upazilaMatch = filters.upazila === "All" || item.upazila?.toLowerCase().includes(filters.upazila.toLowerCase());
  return bloodMatch && districtMatch && upazilaMatch;
});

const mergeRequests = (apiItems = [], mockItems = []) => {
  const seen = new Set();
  return [...apiItems, ...mockItems].filter((item) => {
    if (!item?._id || seen.has(item._id)) return false;
    seen.add(item._id);
    return true;
  });
};

function AvatarFallback({ name, avatar }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name || "Requester"}
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
        unoptimized
      />
    );
  }
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-black text-red-600">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </span>
  );
}

function RequestCard({ item }) {
  const requester = item.requester || {};
  const location = [item.district, item.upazila].filter(Boolean).join(", ");
  const date = item.donationDate
    ? new Date(item.donationDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex gap-4">
        <div className="shrink-0">
          <AvatarFallback name={item.recipientName} avatar={requester.avatar} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{item.recipientName}</h3>
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-black text-white">{item.bloodGroup}</span>
            {item.status && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[item.status] || STATUS_STYLE.pending}`}>
                {STATUS_LABEL[item.status] || item.status}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            {location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="text-red-400" /> {location}
              </span>
            )}
            {item.hospitalName && (
              <span className="flex items-center gap-1">
                <HiOutlineBuildingOffice2 className="text-red-400" /> {item.hospitalName}
              </span>
            )}
            {date !== "—" && (
              <span className="flex items-center gap-1">
                <FiCalendar className="text-red-400" /> {date}
              </span>
            )}
            {item.donationTime && (
              <span className="flex items-center gap-1">
                <FiClock className="text-red-400" /> {item.donationTime}
              </span>
            )}
          </div>

          {item.requestMessage && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.requestMessage}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex shrink-0 items-start">
        <Link
          href={`/donation-requests/${item._id}`}
          className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-red-700 hover:shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
            p === page
              ? "border-red-600 bg-red-600 text-white"
              : "border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default function DonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingMockData, setUsingMockData] = useState(true);

  const [bloodGroup, setBloodGroup] = useState("All");
  const [district, setDistrict] = useState("All");
  const [upazila, setUpazila] = useState("All");
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState({ bloodGroup: "All", district: "All", upazila: "All" });

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  useEffect(() => {
    fetch("/location/district.json")
      .then((r) => r.json())
      .then((json) => {
        const table = json.find((i) => i.type === "table");
        if (table) setDistricts(table.data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDistrictId) return;
    fetch("/location/upazila.json")
      .then((r) => r.json())
      .then((json) => {
        const table = json.find((i) => i.type === "table");
        if (table) setUpazilas(table.data.filter((u) => u.district_id === selectedDistrictId));
      })
      .catch(() => {});
  }, [selectedDistrictId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        setError("");
        try {
          const res = await donationService.getAll({ ...applied, page: 1, limit: 100 });
          if (res?.success) {
            const combined = filterRequests(mergeRequests(res.data || [], mockDonationRequests), applied);
            const start = (page - 1) * PAGE_SIZE;
            setUsingMockData(true);
            setRequests(combined.slice(start, start + PAGE_SIZE));
            setPagination({
              total: combined.length,
              page,
              pages: Math.max(1, Math.ceil(combined.length / PAGE_SIZE)),
              limit: PAGE_SIZE
            });
          } else {
            const filtered = filterRequests(mockDonationRequests, applied);
            const start = (page - 1) * PAGE_SIZE;
            const paged = filtered.slice(start, start + PAGE_SIZE);
            setUsingMockData(true);
            setRequests(paged);
            setPagination({
              total: filtered.length,
              page,
              pages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
              limit: PAGE_SIZE
            });
          }
      } catch {
        const filtered = filterRequests(mockDonationRequests, applied);
        const start = (page - 1) * PAGE_SIZE;
        const paged = filtered.slice(start, start + PAGE_SIZE);
        setUsingMockData(true);
        setRequests(paged);
        setPagination({
          total: filtered.length,
          page,
          pages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
          limit: PAGE_SIZE
        });
        setError("");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applied, page]);

  const handleSearch = () => {
    setPage(1);
    setApplied({ bloodGroup, district, upazila });
  };

  const handleDistrictChange = (e) => {
    const selected = districts.find((d) => d.name === e.target.value);
    setDistrict(e.target.value);
    setSelectedDistrictId(selected ? selected.id : "");
    if (!selected) setUpazilas([]);
    setUpazila("All");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Hero Header */}
        <section className="border-b border-red-100 bg-white py-8">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-red-500">Home</Link>
              <span>/</span>
              <span className="font-medium text-slate-600">Donation Requests</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-900">Donation Requests</h1>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-slate-100 bg-white py-5 shadow-sm">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-400"
                >
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">District</label>
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-400"
                >
                  <option value="All">All</option>
                  {districts.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500">Upazila</label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  disabled={!selectedDistrictId}
                  className="h-10 min-w-40 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-400 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="All">All</option>
                  {upazilas.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <FiSearch /> Search
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-red-200 bg-white py-20 text-center">
                <FiDroplet className="mx-auto mb-3 text-5xl text-red-200" />
                <p className="font-semibold text-slate-500">No donation requests found.</p>
                <p className="mt-1 text-sm text-slate-400">Try adjusting your search filters.</p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-slate-500">
                  Showing <strong>{requests.length}</strong> of <strong>{pagination.total}</strong> results
                </p>
                {usingMockData && (
                  <p className="mb-4 text-xs font-medium text-amber-600">Showing saved requests with demo requests.</p>
                )}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {requests.map((item) => (
                    <RequestCard key={item._id} item={item} />
                  ))}
                </div>
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.pages}
                  onPage={(p) => setPage(p)}
                />
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

