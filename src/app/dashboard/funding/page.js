"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { FaHeart, FaSearch, FaChevronDown } from "react-icons/fa";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Navbar from "@/Components/Shared/Navbar";
import api from "@/services/api";

export default function FundingPage() {
  const [fundings, setFundings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [amount, setAmount] = useState(25);
  const [donorName, setDonorName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFundingData = async () => {
      try {
        setLoading(true);
        const [historyRes, totalRes] = await Promise.all([api.get("/fundings"), api.get("/fundings/total")]);

        setFundings(historyRes.data.data || []);
        setTotalAmount(totalRes.data.data.totalAmount || 0);
      } catch (err) {
        console.error("Funding load error:", err);
        setError("Unable to load funding data.");
      } finally {
        setLoading(false);
      }
    };

    loadFundingData();
  }, []);

  const filteredFundings = useMemo(() => {
    return fundings.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [fundings, search]);

  const totalDonors = fundings.length;
  const averageDonation = totalDonors > 0 ? totalAmount / totalDonors : 0;

  const handleCreateSession = async () => {
    try {
      const response = await api.post("/stripe/create-session", {
        amountCents: Math.round(amount * 100),
        name: donorName || "Anonymous",
        successUrl: `${window.location.origin}/dashboard/funding?success=1`,
        cancelUrl: `${window.location.origin}/dashboard/funding?canceled=1`
      });

      window.location.href = response.data.url;
    } catch (err) {
      console.error("Stripe session creation failed:", err);
      setError("Unable to initialize payment. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-red-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.24em] text-red-600">Funding History</p>
                <h1 className="mt-2 text-4xl font-black text-slate-950">Every contribution helps save a life.</h1>
                <p className="mt-3 text-sm text-slate-500">Track every contribution and give a new gift directly to the organization.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
                onClick={() => setShowCreate(true)}
              >
                <FaHeart className="text-base" />
                Give Fund
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.5fr_0.95fr]">
              <section className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Total Funds</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">${totalAmount.toFixed(2)}</p>
                    <p className="mt-2 text-xs text-slate-400">All time total funding</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Total Donors</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{totalDonors}</p>
                    <p className="mt-2 text-xs text-slate-400">Total unique contributions</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Average Donation</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">${averageDonation.toFixed(2)}</p>
                    <p className="mt-2 text-xs text-slate-400">Based on funded entries</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Latest Payment</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{fundings[0]?.paymentMethod || "—"}</p>
                    <p className="mt-2 text-xs text-slate-400">Most recent transaction method</p>
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">All Funding History</h2>
                      <p className="mt-1 text-sm text-slate-500">Track every donation at a glance.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="relative rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                        <FaSearch className="mr-2 inline" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search by donor name..."
                          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        All Status
                        <FaChevronDown className="text-sm text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Loading funding records...</div>
                  ) : error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-4 font-semibold">Donor</th>
                            <th className="px-4 py-4 font-semibold">Amount</th>
                            <th className="px-4 py-4 font-semibold">Date</th>
                            <th className="px-4 py-4 font-semibold">Payment</th>
                            <th className="px-4 py-4 font-semibold">Status</th>
                            <th className="px-4 py-4 font-semibold">Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {filteredFundings.map((row) => (
                            <tr key={row.transactionId || row._id} className="transition hover:bg-slate-50">
                              <td className="px-4 py-4 font-semibold text-slate-900">{row.name}</td>
                              <td className="px-4 py-4 text-red-600">${(row.amount / 100).toFixed(2)}</td>
                              <td className="px-4 py-4 text-slate-500">{new Date(row.createdAt).toLocaleString()}</td>
                              <td className="px-4 py-4 text-slate-500">{row.paymentMethod || "Card"}</td>
                              <td className="px-4 py-4 text-sm font-semibold text-emerald-600">{row.status || "Completed"}</td>
                              <td className="px-4 py-4 text-slate-500">{row.transactionId || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              <aside className="space-y-4">
                <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Funding Summary</p>
                      <h2 className="mt-3 text-2xl font-black text-slate-950">Thank You!</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Your support is making a real difference for donors and patients across our network.</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                      <FaHeart className="text-2xl" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>One Time</span>
                      <span>${(totalAmount * 0.74).toFixed(2)}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[74%] rounded-full bg-red-600" />
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Recurring</span>
                      <span>${(totalAmount * 0.26).toFixed(2)}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[26%] rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span>Today's Funds</span>
                      <strong className="text-slate-900">$350.00</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 pt-3">
                      <span>This Week</span>
                      <strong className="text-slate-900">$1,250.00</strong>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <span>This Month</span>
                      <strong className="text-slate-900">$2,350.00</strong>
                    </div>
                  </div>

                  <button className="mt-6 w-full rounded-3xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                    Download Report
                  </button>
                </div>

                <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Image src="/funding.png" alt="Funding illustration" width={320} height={220} className="rounded-[26px] object-cover" />
                  </div>
                  <div className="mt-5 space-y-2 text-sm text-slate-500">
                    <p className="font-semibold text-slate-900">Donor support in action</p>
                    <p>Share this page with volunteers and donors so everyone can keep funding momentum moving.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
              <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">Give Fund</h2>
                    <p className="mt-2 text-sm text-slate-500">Enter a donation amount and submit to support the platform.</p>
                  </div>
                  <button onClick={() => setShowCreate(false)} className="text-slate-400 transition hover:text-slate-700">Close</button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Donation Amount
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Donor Name
                    <input
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSession}
                    className="rounded-3xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </ProtectedRoute>
  );
}
