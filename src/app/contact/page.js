import Navbar from "@/Components/Shared/Navbar";
import Footer from "@/Components/Shared/Footer";
import ContactSection from "@/Components/Public/ContactSection";

export const metadata = {
  title: "Contact | BloodConnect"
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="border-b border-red-100 bg-gradient-to-r from-red-50 to-rose-50 py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-slate-900">Contact Us</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Reach out for blood campaigns, hospital partnerships, and emergency coordination support.
            </p>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
