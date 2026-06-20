import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";

export const metadata = {
  title: "About Us | BloodDonor"
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-slate-900">About BloodDonor</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              BloodDonor is dedicated to connecting verified blood donors with urgent patient requests. Our goal is simple:
              reduce response time and increase successful life-saving donations across Bangladesh.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            <article className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ensure no patient suffers due to blood shortage by building a trusted digital donor network.
              </p>
            </article>
            <article className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A responsive nationwide donation ecosystem where every urgent request finds a donor quickly.
              </p>
            </article>
            <article className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Our Values</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Trust, transparency, and humanity drive every feature and every community effort.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
