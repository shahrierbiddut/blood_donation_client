"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaChevronDown, FaHeart, FaSearch, FaTimesCircle } from "react-icons/fa";
import Navbar from "@/Components/Shared/Navbar";
import api from "@/services/api";

const CAMPAIGNS = [
  {
    name: "Emergency Blood Support",
    goalCents: 500000,
    description: "Fund urgent matching, calls, and emergency patient coordination.",
    suggestedAmounts: [10, 25, 50]
  },
  {
    name: "Hospital Transport",
    goalCents: 350000,
    description: "Support donor transport, hospital trips, and last-mile logistics.",
    suggestedAmounts: [5, 15, 30]
  },
  {
    name: "Volunteer Operations",
    goalCents: 250000,
    description: "Help volunteers run campaigns, verification, and donor outreach.",
    suggestedAmounts: [5, 10, 25]
  }
];

const QUICK_AMOUNTS = [5, 10, 25, 50];
const STATUS_OPTIONS = ["all", "Completed", "Pending"];

const formatMoney = (cents = 0) => `$${(Number(cents || 0) / 100).toFixed(2)}`;
const toCents = (amount) => Math.max(0, Math.round(Number(amount || 0) * 100));

const getCampaignStats = (campaign, fundings) => {
  const records = fundings.filter((item) => (item.campaign || CAMPAIGNS[0].name) === campaign.name);
  const raisedCents = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const donorCount = records.length;
  const progress = Math.min(100, Math.round((raisedCents / campaign.goalCents) * 100));
  return { raisedCents, donorCount, progress };
};

function CampaignCard({ campaign, fundings, selected, onSelect }) {
  const stats = getCampaignStats(campaign, fundings);

  return (
    <button
      type="button"
      onClick={() => onSelect(campaign, campaign.suggestedAmounts[1])}
      className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "border-red-400 ring-2 ring-red-100" : "border-red-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black text-slate-950">{campaign.name}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{campaign.description}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
          <FaHeart />
        </span>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>{formatMoney(stats.raisedCents)} raised</span>
          <span>{formatMoney(campaign.goalCents)} goal</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-red-600" style={{ width: `${stats.progress}%` }} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-500">{stats.donorCount} donors</span>
        <span className="font-black text-red-600">{stats.progress}%</span>
      </div>
    </button>
  );
}

export default function FundingExperience() {
  const [fundings, setFundings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(CAMPAIGNS[0]);
  const [amount, setAmount] = useState(25);
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadFundingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [historyRes, totalRes] = await Promise.all([
        api.get("/fundings"),
        api.get("/fundings/total")
      ]);

      setFundings(historyRes.data.data || []);
      setTotalAmount(totalRes.data.data.totalAmount || 0);
    } catch (err) {
      console.error("Funding load error:", err);
      setError("Unable to load funding data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFundingData();

    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setNotice({ type: "success", message: "Thank you! Your funding was completed successfully." });
    }
    if (params.get("canceled") === "1") {
      setNotice({ type: "error", message: "Payment was canceled. You can try again anytime." });
    }
  }, []);

  const filteredFundings = useMemo(() => {
    const term = search.toLowerCase();

    return fundings.filter((item) => {
      const campaign = item.campaign || CAMPAIGNS[0].name;
      const status = item.status || "Completed";
      const text = `${item.name || ""} ${campaign} ${item.message || ""} ${item.transactionId || ""}`.toLowerCase();
      return (
        text.includes(term) &&
        (statusFilter === "all" || status === statusFilter) &&
        (campaignFilter === "all" || campaign === campaignFilter)
      );
    });
  }, [fundings, search, statusFilter, campaignFilter]);

  const openDonationModal = (campaign = selectedCampaign, suggestedAmount = amount) => {
    setSelectedCampaign(campaign);
    setAmount(suggestedAmount);
    setError(null);
    setShowCreate(true);
  };

  const handleCreateSession = async () => {
    const amountCents = toCents(amount);

    if (amountCents < 100) {
      setError("Minimum funding amount is $1.00.");
      return;
    }

    try {
      setPaying(true);
      setError(null);
      const response = await api.post("/stripe/create-session", {
        amountCents,
        name: donorName || "Anonymous",
        campaign: selectedCampaign.name,
        message: donorMessage,
        anonymous,
        successUrl: `${window.location.origin}/dashboard/funding?success=1`,
        cancelUrl: `${window.location.origin}/dashboard/funding?canceled=1`
      });

      window.location.href = response.data.url;
    } catch (err) {
      console.error("Stripe session creation failed:", err);
      setError(err?.response?.data?.message || "Unable to initialize payment. Please check Stripe configuration and try again.");
    } finally {
      setPaying(false);
    }
  };

  const totalDonors = fundings.length;
  const averageDonation = totalDonors > 0 ? totalAmount / totalDonors : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Funding Center</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">Every contribution helps save a life.</h1>
              <p className="mt-3 text-sm text-slate-500">Support verified emergency coordination, hospital transport, and volunteer operations.</p>
            </div>
            <button type="button" onClick={() => openDonationModal()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700">
              <FaHeart />
              Give Fund
            </button>
          </div>

          {notice ? (
            <div className={`mb-6 flex items-center gap-3 rounded-xl border px-5 py-4 text-sm font-bold ${notice.type === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>
              {notice.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
              {notice.message}
            </div>
          ) : null}

          <section className="mb-6 grid gap-4 lg:grid-cols-3">
            {CAMPAIGNS.map((campaign) => (
              <CampaignCard key={campaign.name} campaign={campaign} fundings={fundings} selected={selectedCampaign.name === campaign.name} onSelect={openDonationModal} />
            ))}
          </section>

          <div className="grid gap-4 xl:grid-cols-[1.5fr_0.95fr]">
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Total Funds</p>
                  <p className="mt-3 text-2xl font-black text-slate-950">${totalAmount.toFixed(2)}</p>
                  <p className="mt-2 text-xs text-slate-400">All time total funding</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Total Donors</p>
                  <p className="mt-3 text-2xl font-black text-slate-950">{totalDonors}</p>
                  <p className="mt-2 text-xs text-slate-400">Total contributions</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Average Donation</p>
                  <p className="mt-3 text-2xl font-black text-slate-950">${averageDonation.toFixed(2)}</p>
                  <p className="mt-2 text-xs text-slate-400">Based on funded entries</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Latest Payment</p>
                  <p className="mt-3 text-2xl font-black text-slate-950">{fundings[0]?.paymentMethod || "Card"}</p>
                  <p className="mt-2 text-xs text-slate-400">Most recent method</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">Funding History</h2>
                    <p className="mt-1 text-sm text-slate-500">Search, filter, and review every contribution.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                      <FaSearch className="mr-2 inline" />
                      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search donor or campaign" className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                    </label>
                    <label className="relative">
                      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none">
                        {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item === "all" ? "All Status" : item}</option>)}
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                    </label>
                    <label className="relative">
                      <select value={campaignFilter} onChange={(event) => setCampaignFilter(event.target.value)} className="h-full w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none">
                        <option value="all">All Campaigns</option>
                        {CAMPAIGNS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                    </label>
                  </div>
                </div>

                {loading ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Loading funding records...</div>
                ) : error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>
                ) : filteredFundings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                    <p className="text-lg font-black text-slate-900">No funding records found</p>
                    <p className="mt-2 text-sm text-slate-500">Try another search/filter or become the first donor for this campaign.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-4 font-semibold">Donor</th>
                          <th className="px-4 py-4 font-semibold">Campaign</th>
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
                            <td className="px-4 py-4 font-semibold text-slate-900">{row.anonymous ? "Anonymous" : row.name}</td>
                            <td className="px-4 py-4 text-slate-500">{row.campaign || CAMPAIGNS[0].name}</td>
                            <td className="px-4 py-4 font-bold text-red-600">{formatMoney(row.amount)}</td>
                            <td className="px-4 py-4 text-slate-500">{new Date(row.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-4 text-slate-500">{row.paymentMethod || "card"}</td>
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
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Funding Summary</p>
                    <h2 className="mt-3 text-2xl font-black text-slate-950">Campaign Momentum</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Your support keeps urgent donor coordination moving.</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><FaHeart className="text-2xl" /></div>
                </div>

                <div className="mt-6 space-y-4">
                  {CAMPAIGNS.map((campaign) => {
                    const stats = getCampaignStats(campaign, fundings);
                    return (
                      <div key={campaign.name} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-slate-700">{campaign.name}</span>
                          <span className="text-slate-500">{formatMoney(stats.raisedCents)}</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-red-600" style={{ width: `${stats.progress}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => openDonationModal()} className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700">Support a Campaign</button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <Image src="/funding.png" alt="Funding illustration" width={320} height={220} className="w-full rounded-xl object-cover" />
                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  <p className="font-semibold text-slate-900">Donor support in action</p>
                  <p>Share this page with volunteers and donors so everyone can keep funding momentum moving.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Give Fund</h2>
                  <p className="mt-2 text-sm text-slate-500">Choose a campaign, amount, and continue to Stripe Checkout.</p>
                </div>
                <button onClick={() => setShowCreate(false)} className="text-sm font-bold text-slate-400 transition hover:text-slate-700">Close</button>
              </div>

              {error ? <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

              <div className="mt-6 space-y-5">
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Campaign
                  <select value={selectedCampaign.name} onChange={(event) => setSelectedCampaign(CAMPAIGNS.find((item) => item.name === event.target.value) || CAMPAIGNS[0])} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none">
                    {CAMPAIGNS.map((campaign) => <option key={campaign.name} value={campaign.name}>{campaign.name}</option>)}
                  </select>
                </label>

                <div>
                  <p className="text-sm font-semibold text-slate-700">Donation Amount</p>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {QUICK_AMOUNTS.map((item) => (
                      <button key={item} type="button" onClick={() => setAmount(item)} className={`rounded-xl border px-4 py-3 text-sm font-black transition ${Number(amount) === item ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 bg-white text-slate-700 hover:border-red-200"}`}>${item}</button>
                    ))}
                  </div>
                  <input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-slate-700">
                    Donor Name
                    <input value={donorName} onChange={(event) => setDonorName(event.target.value)} disabled={anonymous} placeholder="Your name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none disabled:text-slate-400" />
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="h-4 w-4 accent-red-600" />
                    Donate anonymously
                  </label>
                </div>

                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Optional Message
                  <textarea value={donorMessage} onChange={(event) => setDonorMessage(event.target.value)} rows={3} maxLength={500} placeholder="Leave a short note for the team" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={handleCreateSession} disabled={paying} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:bg-red-300">{paying ? "Preparing payment..." : "Continue to payment"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
