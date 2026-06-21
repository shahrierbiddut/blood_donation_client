import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa6";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-red-100 bg-white px-4 pb-6 pt-2 sm:px-6 lg:px-8">
      <div className="footer-blood-gradient mx-auto w-full max-w-7xl rounded-xl border border-red-950/40 px-6 py-10 text-red-50 shadow-2xl lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="inline-flex h-9 w-16 items-center justify-center rounded-md bg-white/10 px-2">
                <svg viewBox="0 0 96 32" className="h-6 w-full" aria-hidden="true">
                  <path
                    d="M7 18 H24 L28 11 L31 24 L35 13 L39 18 H54"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M65 4 C60 10 56 14 56 19 C56 25 60.5 29 66 29 C71.5 29 76 25 76 19 C76 14 71 9 66 4 Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M61.8 19.2 C61.8 17.1 63.5 15.4 65.6 15.4 C66.9 15.4 67.9 16.1 68.6 17.2 C69.3 16.1 70.3 15.4 71.6 15.4 C73.7 15.4 75.4 17.1 75.4 19.2 C75.4 22.2 72.7 24.1 68.6 27 C64.5 24.1 61.8 22.2 61.8 19.2 Z"
                    fill="#9f1239"
                  />
                  <path
                    d="M76 18 H82 L85 13 L88 23 L91 18 H95"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
              {[FaFacebookF, FaInstagram, FaPinterestP].map((Icon, index) => (
                <button
                  key={`${Icon.displayName || "icon"}-${index}`}
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-white text-sm text-red-700 shadow-sm transition hover:scale-105"
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
