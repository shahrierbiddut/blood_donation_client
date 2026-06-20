"use client";

import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setDone(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-bg py-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Need Help or Partnership?</h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Contact our support team for emergency donor campaigns, hospital onboarding, or volunteer initiatives.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Emergency Helpline</p>
              <p className="text-sm text-slate-600">+880 1700 000000</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Support Email</p>
              <p className="text-sm text-slate-600">support@bloodconnect.org</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Office</p>
              <p className="text-sm text-slate-600">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-red-100 bg-white p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900">Send a message</h3>
          <p className="mt-1 text-sm text-slate-500">We usually respond within 2 business hours.</p>

          <div className="mt-5 space-y-4">
            <Input
              label="Name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextArea
              label="Message"
              minRows={4}
              placeholder="How can we help you?"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            />

            <Button type="submit" className="w-full bg-red-600 font-semibold text-white">
              Send Message
            </Button>

            {done && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                Thanks. Your message has been sent successfully.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
