"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/Components/Admin/StatusBadge";
import { requests as mockRequests } from "@/data/adminMock";
import { FiArrowLeft, FiCalendar, FiClock, FiDroplet, FiEdit2, FiHeart, FiMapPin, FiRefreshCw, FiSend, FiTrash2, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const extraDonations = [
  {
    id: "d9",
    recipientName: "Mariam Akter",
    recipientAvatar: "https://i.pravatar.cc/120?img=32",
    bloodGroup: "B+",
    district: "Chattogram",
    upazila: "Agrabad",
    hospital: "Chattogram Medical College Hospital",
    donationDate: "2026-05-24",
    donationTime: "14:30",
    status: "inprogress",
    message: "Patient needs urgent blood support after dengue complications.",
    donor: { name: "Tahmina Akter", avatar: "https://i.pravatar.cc/120?img=47", email: "tahmina@email.com", phone: "+880 1811-334455" }
  },
  {
    id: "d10",
    recipientName: "Sadia Islam",
    recipientAvatar: "https://i.pravatar.cc/120?img=45",
    bloodGroup: "AB+",
    district: "Sylhet",
    upazila: "Zindabazar",
    hospital: "Sylhet MAG Osmani Medical College",
    donationDate: "2026-05-22",
    donationTime: "09:45",
    status: "cancelled",
    message: "Blood was arranged before volunteer confirmation.",
    donor: { name: "Nusrat Jahan", avatar: "https://i.pravatar.cc/120?img=35", email: "nusrat@email.com", phone: "+880 1911-334455" }
  }
];

const statusOptions = [
  { value: "pending", label: "Pending", dot: "bg-amber-400" },
  { value: "inprogress", label: "In Progress", dot: "bg-blue-500" },
  { value: "done", label: "Done", dot: "bg-emerald-500" },
  { value: "cancelled", label: "Cancelled", dot: "bg-red-500" }
];

const STATUS_STORAGE_KEY = "blood_donation_admin_status_overrides";

const getStatusOverrides = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STATUS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveStatusOverride = (id, status) => {
  if (typeof window === "undefined") return;
  const current = getStatusOverrides();
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify({ ...current, [id]: status }));
};

function SummaryCard({ icon: Icon, label, value, tone = "red" }) {
  const toneClass = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-50 text-slate-600"
  }[tone];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <span className={`grid h-14 w-14 place-items-center rounded-full ${toneClass}`}>
          <Icon size={26} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ icon: Icon, title, children, tone = "red" }) {
  const toneClass = tone === "green" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600";
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-black text-red-600">
        <span className={`grid h-10 w-10 place-items-center rounded-full ${toneClass}`}><Icon /></span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-4 py-1.5 text-sm">
      <p className="font-semibold text-slate-500">{label}</p>
      <p className="font-bold text-slate-900">{value || "Not provided"}</p>
    </div>
  );
}

export default function DonationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const donations = useMemo(() => [...mockRequests, ...extraDonations], []);
  const donation = donations.find((item) => item.id === params?.id);
  const initialStatus = donation?.id ? getStatusOverrides()[donation.id] || donation.status : "pending";
  const [status, setStatus] = useState(initialStatus);
  const [savedStatus, setSavedStatus] = useState(initialStatus);

  if (!donation) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Donation record not found</h1>
        <Link href="/admin/all-donations" className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white">Back to All Donations</Link>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    saveStatusOverride(donation.id, status);
    setSavedStatus(status);
    toast.success(`Donation status updated to ${statusOptions.find((item) => item.value === status)?.label || status}`);
  };

  const handleDelete = () => {
    toast.success("Donation request deleted");
    router.push("/admin/all-donations");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Donation Request Details</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Dashboard / All Donations / <span className="text-red-600">Details</span></p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
            <FiEdit2 /> Edit Request
          </button>
          <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-red-700">
            <FiTrash2 /> Delete Request
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <SummaryCard icon={FiDroplet} label="Blood Group" value={donation.bloodGroup} />
        <SummaryCard icon={FiCalendar} label="Donation Date" value={donation.donationDate} />
        <SummaryCard icon={FiClock} label="Donation Time" value={donation.donationTime} />
        <SummaryCard icon={FiClock} label="Current Status" value={<StatusBadge status={savedStatus} />} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <InfoPanel icon={FiUser} title="Recipient Information">
            <InfoRow label="Name" value={donation.recipientName} />
            <InfoRow label="Blood Group" value={donation.bloodGroup} />
            <InfoRow label="District" value={donation.district} />
            <InfoRow label="Upazila" value={donation.upazila} />
            <InfoRow label="Hospital / Location" value={donation.hospital} />
            <InfoRow label="Request Date" value={donation.donationDate} />
            <InfoRow label="Request Time" value={donation.donationTime} />
            <InfoRow label="Additional Message" value={donation.message || "Need blood for my father. Please help us."} />
          </InfoPanel>

          <InfoPanel icon={FiUser} title="Requester Information">
            <InfoRow label="Name" value="Sakib Hasan" />
            <InfoRow label="Email" value="sakib.hasan@email.com" />
            <InfoRow label="Phone" value="+880 1711-223344" />
          </InfoPanel>

          <InfoPanel icon={FiUser} title="Donor Information" tone="green">
            <InfoRow label="Name" value={donation.donor?.name || "Not assigned"} />
            <InfoRow label="Email" value={donation.donor?.email || "Not available"} />
            <InfoRow label="Phone" value={donation.donor?.phone || "+880 1811-334455"} />
          </InfoPanel>
        </div>

        <div>
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-black text-red-600">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600"><FiHeart /></span>
              Donation Status
            </h2>

            <div>
              <p className="text-sm font-bold text-slate-700">Current Status</p>
              <div className="mt-2"><StatusBadge status={savedStatus} /></div>
            </div>

            <div className="my-8 h-px bg-slate-100" />

            <h3 className="mb-5 flex items-center gap-3 text-lg font-black text-red-600">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600"><FiRefreshCw /></span>
              Update Status
            </h3>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Select New Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-12 w-full rounded-lg border border-red-400 bg-white px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-red-100">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <div className="mt-3 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
              {statusOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => setStatus(option.value)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold ${status === option.value ? "bg-red-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}>
                  <span className={`h-3 w-3 rounded-full ${option.dot}`} />
                  {option.label}
                </button>
              ))}
            </div>

            <button onClick={handleUpdateStatus} className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-4 py-4 text-sm font-black text-white shadow-sm hover:bg-red-700">
              Update Status <FiSend />
            </button>
          </section>
        </div>
      </div>

      <Link href="/admin/all-donations" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
        <FiArrowLeft /> Back to All Donations
      </Link>
    </div>
  );
}
