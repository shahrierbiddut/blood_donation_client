// src/app/register/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Card, Spinner } from "@heroui/react";
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];
const UPAZILAS = ["Upazila 1", "Upazila 2", "Upazila 3"]; // Simplified for now

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    address: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.upazila) {
      newErrors.upazila = "Upazila is required";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    setSubmitError("");
  };

  /**
   * Handle select change
   */
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
      router.push("/dashboard");
    } catch (err) {
      setSubmitError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Blood Bank</h1>
          <p className="text-gray-600">Create your account and join our community</p>
        </div>

        {/* Registration Card */}
        <Card className="p-8 shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {(submitError || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {submitError || authError}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                startContent={<HiOutlineUser className="text-gray-400" />}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                className="w-full"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                startContent={<HiOutlineEnvelope className="text-gray-400" />}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                className="w-full"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+880..."
                value={formData.phone}
                onChange={handleInputChange}
                startContent={<HiOutlinePhone className="text-gray-400" />}
                className="w-full"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Blood Group Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) => handleSelectChange("bloodGroup", e.target.value)}
                disabled={isSubmitting || loading}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select your blood group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>

            {/* District Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={(e) => handleSelectChange("district", e.target.value)}
                disabled={isSubmitting || loading}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select your district</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
            </div>

            {/* Upazila Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upazila *
              </label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={(e) => handleSelectChange("upazila", e.target.value)}
                disabled={isSubmitting || loading}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select your upazila</option>
                {UPAZILAS.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
              {errors.upazila && <p className="text-red-600 text-sm mt-1">{errors.upazila}</p>}
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                placeholder="Your street address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                startContent={<HiOutlineLockClosed className="text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="text-gray-400" />
                    ) : (
                      <HiOutlineEye className="text-gray-400" />
                    )}
                  </button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                className="w-full"
                disabled={isSubmitting || loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Must contain uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                startContent={<HiOutlineLockClosed className="text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeSlash className="text-gray-400" />
                    ) : (
                      <HiOutlineEye className="text-gray-400" />
                    )}
                  </button>
                }
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                className="w-full"
                disabled={isSubmitting || loading}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: "" }));
                  }
                }}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded"
                disabled={isSubmitting || loading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-red-600 hover:text-red-700 font-semibold">
                  terms and conditions
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-red-600 hover:text-red-700 font-semibold">
                  privacy policy
                </Link>
              </label>
            </div>
            {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-300"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Spinner size="sm" color="current" /> Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>🩸 Your information is secure and confidential. We never share your data.</p>
        </div>
      </div>
    </div>
  );
}
