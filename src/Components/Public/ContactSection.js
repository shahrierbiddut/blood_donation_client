"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import contactService from "@/services/contactService";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
    if (form.phone.trim() && form.phone.trim().length > 20) return "Phone number must be 20 characters or less";
    if (form.address.trim() && form.address.trim().length > 200) return "Address must be 200 characters or less";
    if (!form.subject.trim()) return "Subject is required";
    if (form.subject.trim().length < 5) return "Subject must be at least 5 characters";
    if (!form.message.trim()) return "Message is required";
    if (form.message.trim().length < 10) return "Message must be at least 10 characters";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      toast.loading("Sending your message...");

      await contactService.create(form);

      toast.dismiss();
      toast.success("✅ Thank you! Your message has been sent successfully. We'll get back to you soon!");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", address: "", subject: "", message: "" });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      toast.dismiss();
      const validationDetails = err?.response?.data?.data?.errors
        ?.map((item) => `${item.field}: ${item.message}`)
        .join(", ");
      const errorMsg = validationDetails || err?.response?.data?.message || "Failed to send message. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-bg py-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Need Help or Partnership?</h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Contact our support team for emergency donor campaigns, hospital onboarding, or volunteer initiatives.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">Emergency Helpline</p>
              <p className="text-sm text-red-600 font-semibold">01775198524</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">Support Email</p>
              <p className="text-sm text-red-600 font-semibold">shahrierhossainbiddut@gmail.com</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">Office</p>
              <p className="text-sm text-slate-700">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-red-100 bg-white p-8 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900">Send a message</h3>
          <p className="mt-1 text-sm text-slate-500">We usually respond within 2 business hours.</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              ✅ Thank you! Your message has been sent successfully.
            </div>
          )}

          <div className="mt-6 space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="01775198524"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Your address or area"
                value={form.address}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subject <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={form.subject}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="How can we help you? Please provide detailed information..."
                value={form.message}
                onChange={handleChange}
                disabled={loading}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            <p className="text-xs text-slate-500 text-center">
              We respect your privacy. Your message will be kept confidential.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
