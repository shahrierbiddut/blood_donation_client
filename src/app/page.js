import Link from "next/link";
import { Button } from "@heroui/react";
import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import HeroSection from "@/Components/Public/HeroSection";
import FeaturedSection from "@/Components/Public/FeaturedSection";
import ContactSection from "@/Components/Public/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <HeroSection />
        <FeaturedSection />

        <section className="bg-slate-50 py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
              <p className="mt-2 text-slate-600">Four simple steps to save lives through verified donation matching.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                { step: "01", title: "Create Account", desc: "Register as donor, volunteer, or recipient support." },
                { step: "02", title: "Find Match", desc: "Search requests or donors by blood group and location." },
                { step: "03", title: "Confirm", desc: "Coordinate with hospital and confirm donation safely." },
                { step: "04", title: "Complete", desc: "Track donation completion and update history." }
              ].map((item) => (
                <article key={item.step} className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-red-600 py-16 text-white">
          <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold">Ready to Save a Life?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-red-100">
              Join BloodConnect and respond to urgent blood requests in your community.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-red-50">
              You can also fund emergency donor coordination, hospital transport, and volunteer operations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button className="bg-white px-8 font-semibold text-red-600">Join as Donor</Button>
              </Link>
              <Link href="/donation-requests">
                <Button className="border border-white bg-transparent px-8 font-semibold text-white">Browse Requests</Button>
              </Link>
              <Link href="/dashboard/funding">
                <Button className="border border-white bg-white/10 px-8 font-semibold text-white">Support the Mission</Button>
              </Link>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
