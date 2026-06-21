"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { FaDroplet } from "react-icons/fa6";
import { FiBell, FiChevronDown, FiGrid, FiLogOut, FiUser } from "react-icons/fi";

const publicNavItems = [
  { label: "Home", href: "/" },
  { label: "Donation Requests", href: "/donation-requests" },
  { label: "Search Donors", href: "/search-donors" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

const authNavItems = [
  { label: "Home", href: "/" },
  { label: "Donation Requests", href: "/donation-requests" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

function UserAvatar({ user, size = "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  if (user?.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={user.name || "Profile"}
        width={size === "sm" ? 32 : 36}
        height={size === "sm" ? 32 : 36}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-red-100`}
        unoptimized
      />
    );
  }
  return (
    <span className={`flex ${sizeClass} items-center justify-center rounded-full bg-red-100 font-bold text-red-600`}>
      {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Profile";
  const displayName = user?.name || user?.email?.split("@")[0] || roleLabel;
  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
            <FaDroplet className="text-sm" />
          </span>
          <span>
            <span className="text-red-600">Blood</span>
            <span className="text-slate-900">Life</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-semibold transition ${
                  isActive ? "text-red-600" : "text-slate-700 hover:text-red-600"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-red-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Notifications"
              >
                <FiBell className="text-lg" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-red-50"
                >
                  <UserAvatar user={user} />
                  <div className="hidden text-left lg:block">
                    <p className="max-w-[100px] truncate text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[10px] capitalize text-red-600">{roleLabel}</p>
                  </div>
                  <FiChevronDown className={`text-slate-400 transition ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-red-100 bg-white p-2 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-red-50 px-2 pb-3 pt-1">
                      <UserAvatar user={user} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
                        <p className="text-xs font-semibold capitalize text-red-600">{roleLabel}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <FiGrid className="text-base" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <FiLogOut className="text-base" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
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

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-red-100 bg-white px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-red-600 text-white" : "text-slate-700 hover:bg-red-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-3">
              {isAuthenticated ? (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                  <div className="mb-3 flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                      <p className="text-xs font-semibold capitalize text-red-600">{roleLabel}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button className="w-full bg-red-600 text-white">Dashboard</Button>
                    </Link>
                    <Button className="flex-1 border border-red-300 bg-white text-red-600" onPress={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button className="w-full border border-red-300 bg-white text-red-600">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button className="w-full bg-red-600 text-white">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
