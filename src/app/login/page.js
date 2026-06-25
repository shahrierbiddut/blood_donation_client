"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@heroui/react";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { FaFacebookF, FaGoogle, FaHeart, FaShieldAlt, FaSignInAlt, FaTint, FaUsers } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bloodGraphic from "../../../Assets/Blood.png";

const featureItems = [
  { icon: FaTint, title: "Save Lives", desc: "Your donation can save up to 3 lives" },
  { icon: FaUsers, title: "Trusted Community", desc: "Join thousands of verified donors" },
  { icon: FaShieldAlt, title: "Safe & Secure", desc: "We ensure a safe and secure process" }
];

const trustItems = [
  { icon: FaShieldAlt, title: "100% Secure", desc: "Your data is protected" },
  { icon: HiOutlineLockClosed, title: "Privacy First", desc: "We respect your privacy" },
  { icon: FaHeart, title: "Community Driven", desc: "Together we save lives" }
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Signing in...");
      const res = await login(formData.email, formData.password);
      toast.dismiss();
      toast.success("Welcome back! Redirecting...");
      const redirectPath = res.user?.role === "admin" ? "/dashboard/admin" : "/dashboard";
      setTimeout(() => router.push(redirectPath), 800);
    } catch (err) {
      toast.dismiss();
      const errorMsg = err.message || "Login failed. Please try again.";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl shadow-slate-200 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-white via-red-50 to-red-100 px-10 py-10 lg:block">
          <div className="absolute right-5 top-10 h-80 w-64 rounded-full bg-red-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-red-600" />
          <div className="absolute bottom-14 left-[-8%] h-28 w-[120%] rounded-[50%] bg-white" />
          <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 [background-image:linear-gradient(110deg,transparent_0_35%,#fff_35%_36%,transparent_36%_47%,#fff_47%_48%,transparent_48%)]" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
                <FaTint />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-tight text-slate-900">
                  Blood<span className="text-red-600">Bridge</span>
                </span>
                <span className="block text-xs font-semibold text-slate-500">Donate Blood, Save Lives</span>
              </span>
            </Link>

            <div className="mt-16">
              <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-black text-red-600 shadow-sm">
                <FaHeart /> Every Drop Counts
              </span>
              <h1 className="mt-7 max-w-md text-5xl font-black leading-tight tracking-tight text-slate-950">
                Donate Blood, <span className="block text-red-600">Save Lives</span>
              </h1>
              <p className="mt-5 max-w-md text-base font-medium leading-8 text-slate-600">
                Join our community of lifesavers and help patients in need. Together, we can make a real difference.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              {featureItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-red-600 shadow-md shadow-red-100">
                      <Icon />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-slate-900">{item.title}</span>
                      <span className="block text-xs font-semibold text-slate-500">{item.desc}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 w-[360px] -translate-x-1/2">
            <Image src={bloodGraphic} alt="Blood donation support" className="h-auto w-full object-contain drop-shadow-2xl" priority />
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-xl shadow-slate-200/70 sm:px-9">
              <div className="mb-8 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50 ring-8 ring-red-50/60">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-red-600 text-2xl text-white shadow-lg shadow-red-200">
                    <FaTint />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-black text-slate-900">Welcome Back</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {(submitError || authError) ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {submitError || authError}
                  </div>
                ) : null}

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Email Address</span>
                  <span className="relative mt-2 block">
                    <HiOutlineEnvelope className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting || loading}
                      className={`h-12 w-full rounded-lg border bg-white px-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-50 disabled:bg-slate-50 ${errors.email ? "border-red-400" : "border-slate-200"}`}
                    />
                  </span>
                  {errors.email ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.email}</span> : null}
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Password</span>
                  <span className="relative mt-2 block">
                    <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isSubmitting || loading}
                      className={`h-12 w-full rounded-lg border bg-white px-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-50 disabled:bg-slate-50 ${errors.password ? "border-red-400" : "border-slate-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <HiOutlineEyeSlash size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </span>
                  {errors.password ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.password}</span> : null}
                </label>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-red-600"
                    />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="font-bold text-red-600 transition hover:text-red-700">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting || loading ? (
                    <>
                      <Spinner size="sm" color="current" /> Signing In...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt /> Sign In
                    </>
                  )}
                </button>

                <div className="flex items-center gap-4 py-1 text-sm font-medium text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  or continue with
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600">
                    <FaGoogle className="text-red-500" /> Continue with Google
                  </button>
                  <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600">
                    <FaFacebookF className="text-blue-600" /> Continue with Facebook
                  </button>
                </div>

                <p className="text-center text-sm font-medium text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-black text-red-600 transition hover:text-red-700">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600">
                      <Icon size={14} />
                    </span>
                    <span>
                      <span className="block text-xs font-black text-slate-900">{item.title}</span>
                      <span className="block text-[10px] font-semibold text-slate-500">{item.desc}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}
