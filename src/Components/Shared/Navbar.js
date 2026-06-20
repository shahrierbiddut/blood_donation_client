"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { FaDroplet } from "react-icons/fa6";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Donation Requests", href: "/donation-requests" },
  { label: "Search Donors", href: "/search-donors" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
          <span className="rounded-full bg-red-50 p-2 text-red-600">
            <FaDroplet className="text-sm" />
          </span>
          <span>BloodDonor</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? "text-red-600"
                    : "text-slate-700 hover:text-red-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
              <Link href="/dashboard">
                <Button size="sm" className="rounded-xl bg-red-600 px-5 font-semibold text-white">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                variant="bordered"
                className="rounded-xl border-red-200 px-5 font-semibold text-slate-700"
                onPress={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="bordered" className="rounded-xl border-slate-300 px-5 font-semibold text-slate-700">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-xl bg-red-600 px-5 font-semibold text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-red-100 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-red-600 text-white" : "text-slate-700 hover:bg-red-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2 flex gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button className="w-full bg-red-600 text-white">Dashboard</Button>
                  </Link>
                  <Button className="flex-1 border border-red-300 bg-white text-red-600" onPress={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button className="w-full border border-red-300 bg-white text-red-600">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button className="w-full bg-red-600 text-white">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
