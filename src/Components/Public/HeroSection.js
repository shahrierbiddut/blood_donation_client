"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import bannerImage from "../../../Assets/Blood.png";

export default function HeroSection() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <section className="hero-bg relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          {/* <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
            Save Lives Faster
          </span> */}
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Donate blood and become someone&apos;s miracle today.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            BloodConnect helps patients, families, and hospitals find verified donors quickly through a clean and modern platform.
          </p>

          <div className="mt-8 flex min-h-11 flex-wrap gap-3">
            {loading ? null : isAuthenticated ? (
              <Link href="/donation-requests">
                <Button className="bg-red-600 px-7 font-semibold text-white">Explore Requests</Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button className="h-11 rounded-xl bg-red-600 px-7 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-red-700">
                    <span className="inline-flex items-center gap-2">
                      <FiArrowRight aria-hidden="true" className="text-base" />
                      Become a Donor
                    </span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="bordered"
                    className="h-11 rounded-xl border-red-300 bg-white px-7 font-semibold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FiSearch aria-hidden="true" className="text-base" />
                      Search Donors
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-red-600">5K+</p>
              <p className="text-xs font-medium text-slate-500">Donors</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-red-600">1.4K</p>
              <p className="text-xs font-medium text-slate-500">Requests</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-red-600">98%</p>
              <p className="text-xs font-medium text-slate-500">Success</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-red-200/60 blur-2xl" />
          <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-rose-300/60 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white p-2 shadow-2xl">
            <Image
              src={bannerImage}
              alt="Blood donation banner"
              priority
              className="h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
