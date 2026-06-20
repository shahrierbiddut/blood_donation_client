import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaDroplet, FaPinterestP } from "react-icons/fa6";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-red-100 bg-white px-4 pb-6 pt-2 sm:px-6 lg:px-8">
      <div className="footer-blood-gradient mx-auto w-full max-w-7xl rounded-xl border border-red-900/30 px-6 py-10 text-red-50 shadow-xl lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <FaDroplet className="text-sm text-white" />
              </span>
              BloodDonor
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-red-100/90">
              Your donation can bring hope to someone in need. Be a part of our mission and help save lives.
            </p>

            <div className="mt-3 w-40">
              <svg viewBox="0 0 180 26" className="h-6 w-full" aria-hidden="true">
                <path
                  d="M2 14 H42 L52 6 L62 20 L74 8 L84 14 H108 L118 10 L130 22 L144 4 L158 14 H178"
                  fill="none"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {[FaFacebookF, FaInstagram, FaPinterestP, FaInstagram].map((Icon, index) => (
                <button
                  key={`${Icon.displayName || "icon"}-${index}`}
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm text-red-700 shadow-sm transition hover:scale-105"
                  aria-label="social icon"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-red-100/95">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/donation-requests" className="hover:text-white">Donation Requests</Link></li>
              <li><Link href="/search-donors" className="hover:text-white">Search Donors</Link></li>
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">For Donors</h4>
            <ul className="mt-4 space-y-2 text-sm text-red-100/95">
              <li><Link href="/register" className="hover:text-white">How to Donate</Link></li>
              <li><Link href="/search-donors" className="hover:text-white">Eligibility</Link></li>
              <li><Link href="/donation-requests" className="hover:text-white">Donation Process</Link></li>
              <li><Link href="/contact" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-red-100/95">
              <li className="flex items-center gap-2">
                <FiPhoneCall className="text-white" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-white" />
                <span>info@blooddonor.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="text-white" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-4 text-center text-sm text-red-100/95">
          © 2026 BloodDonor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
