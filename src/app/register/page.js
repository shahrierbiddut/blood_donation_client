"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle,
  FiDroplet,
  FiEye,
  FiEyeOff,
  FiFlag,
  FiHeart,
  FiImage,
  FiLock,
  FiMail,
  FiMapPin,
  FiMap,
  FiShield,
  FiUser,
  FiUsers
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import locationService from "@/services/locationService";
import uploadService from "@/services/uploadService";
import bannerImage from "../../../Assets/Blood.png";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-hot-toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const defaultForm = {
  name: "",
  email: "",
  bloodGroup: "",
  division: "",
  district: "",
  upazila: "",
  union: "",
  password: "",
  confirmPassword: "",
  avatar: ""
};

const getPasswordStrength = (password) => {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const passed = Object.values(rules).filter(Boolean).length;

  if (!password) {
    return { label: "Weak", score: 0, color: "bg-gray-200", rules };
  }
  if (passed <= 2) {
    return { label: "Weak", score: 1, color: "bg-red-500", rules };
  }
  if (passed === 3) {
    return { label: "Fair", score: 2, color: "bg-orange-500", rules };
  }
  if (passed === 4) {
    return { label: "Good", score: 3, color: "bg-yellow-500", rules };
  }
  return { label: "Strong", score: 4, color: "bg-emerald-500", rules };
};

function FloatingInput({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  error,
  disabled,
  endContent,
  autoComplete
}) {
  return (
    <div>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          disabled={disabled}
          autoComplete={autoComplete}
          className={`peer h-12 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-slate-800 outline-none transition ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-red-100 focus:border-red-500"
          } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
        />
        <label
          htmlFor={name}
          className="pointer-events-none absolute left-10 top-1/2 origin-left -translate-y-1/2 bg-white px-1 text-sm text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-red-600 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs"
        >
          {label}
        </label>
        {endContent ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{endContent}</div>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <FiAlertCircle className="text-sm" /> {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({ label, icon, name, value, options, onChange, error, disabled, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition ${
            error ? "border-red-400 focus:border-red-500" : "border-red-100 focus:border-red-500"
          } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
        >
          <option value="">{placeholder}</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <FiAlertCircle className="text-sm" /> {error}
        </p>
      ) : null}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [notificationState, setNotificationState] = useState({ type: "", message: "", visible: false });

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);

  const [selectedIds, setSelectedIds] = useState({
    divisionId: "",
    districtId: "",
    upazilaId: "",
    unionId: ""
  });

  const [locationLoading, setLocationLoading] = useState({
    divisions: false,
    districts: false,
    upazilas: false,
    unions: false
  });

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        setLocationLoading((prev) => ({ ...prev, divisions: true }));
        const data = await locationService.getDivisions();
        setDivisions(data);
      } catch (error) {
        setApiError("Failed to load location data.");
      } finally {
        setLocationLoading((prev) => ({ ...prev, divisions: false }));
      }
    };

    loadDivisions();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadDistricts = async () => {
      if (!selectedIds.divisionId) {
        setDistricts([]);
        return;
      }

      try {
        setLocationLoading((prev) => ({ ...prev, districts: true }));
        const data = await locationService.getDistricts(selectedIds.divisionId);
        if (mounted) {
          setDistricts(data);
        }
      } catch (error) {
        if (mounted) {
          setApiError("Failed to load districts.");
        }
      } finally {
        if (mounted) {
          setLocationLoading((prev) => ({ ...prev, districts: false }));
        }
      }
    };

    loadDistricts();
    return () => {
      mounted = false;
    };
  }, [selectedIds.divisionId]);

  useEffect(() => {
    let mounted = true;

    const loadUpazilas = async () => {
      if (!selectedIds.districtId) {
        setUpazilas([]);
        return;
      }

      try {
        setLocationLoading((prev) => ({ ...prev, upazilas: true }));
        const data = await locationService.getUpazilas(selectedIds.districtId);
        if (mounted) {
          setUpazilas(data);
        }
      } catch (error) {
        if (mounted) {
          setApiError("Failed to load upazilas.");
        }
      } finally {
        if (mounted) {
          setLocationLoading((prev) => ({ ...prev, upazilas: false }));
        }
      }
    };

    loadUpazilas();
    return () => {
      mounted = false;
    };
  }, [selectedIds.districtId]);

  useEffect(() => {
    let mounted = true;

    const loadUnions = async () => {
      if (!selectedIds.upazilaId) {
        setUnions([]);
        return;
      }

      try {
        setLocationLoading((prev) => ({ ...prev, unions: true }));
        const data = await locationService.getUnions(selectedIds.upazilaId);
        if (mounted) {
          setUnions(data);
        }
      } catch (error) {
        if (mounted) {
          setApiError("Failed to load unions.");
        }
      } finally {
        if (mounted) {
          setLocationLoading((prev) => ({ ...prev, unions: false }));
        }
      }
    };

    loadUnions();
    return () => {
      mounted = false;
    };
  }, [selectedIds.upazilaId]);

  const showSuccessToast = (message) => {
    setNotificationState({ type: "success", message, visible: true });
    setTimeout(() => {
      setNotificationState({ type: "", message: "", visible: false });
    }, 2200);
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleBloodGroupChange = (event) => {
    const selected = BLOOD_GROUPS.find((item) => item === event.target.value) || "";
    setForm((prev) => ({ ...prev, bloodGroup: selected }));
    setErrors((prev) => ({ ...prev, bloodGroup: "" }));
  };

  const handleDivisionChange = (event) => {
    const divisionId = event.target.value;
    const selectedDivision = divisions.find((item) => item.id === divisionId);

    setSelectedIds({
      divisionId,
      districtId: "",
      upazilaId: "",
      unionId: ""
    });

    setForm((prev) => ({
      ...prev,
      division: selectedDivision ? selectedDivision.name : "",
      district: "",
      upazila: "",
      union: ""
    }));

    setDistricts([]);
    setUpazilas([]);
    setUnions([]);
    setApiError("");
    setErrors((prev) => ({ ...prev, division: "", district: "", upazila: "", union: "" }));
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const selectedDistrict = districts.find((item) => item.id === districtId);

    setSelectedIds((prev) => ({
      ...prev,
      districtId,
      upazilaId: "",
      unionId: ""
    }));

    setForm((prev) => ({
      ...prev,
      district: selectedDistrict ? selectedDistrict.name : "",
      upazila: "",
      union: ""
    }));

    setUpazilas([]);
    setUnions([]);
    setApiError("");
    setErrors((prev) => ({ ...prev, district: "", upazila: "", union: "" }));
  };

  const handleUpazilaChange = (event) => {
    const upazilaId = event.target.value;
    const selectedUpazila = upazilas.find((item) => item.id === upazilaId);

    setSelectedIds((prev) => ({
      ...prev,
      upazilaId,
      unionId: ""
    }));

    setForm((prev) => ({
      ...prev,
      upazila: selectedUpazila ? selectedUpazila.name : "",
      union: ""
    }));

    setUnions([]);
    setApiError("");
    setErrors((prev) => ({ ...prev, upazila: "", union: "" }));
  };

  const handleUnionChange = (event) => {
    const unionId = event.target.value;
    const selectedUnion = unions.find((item) => item.id === unionId);

    setSelectedIds((prev) => ({
      ...prev,
      unionId
    }));

    setForm((prev) => ({
      ...prev,
      union: selectedUnion ? selectedUnion.name : ""
    }));

    setApiError("");
    setErrors((prev) => ({ ...prev, union: "" }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Only JPG and PNG are allowed." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image must be smaller than 2MB." }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarFile(file);
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required.";
    }

    if (!form.division) {
      newErrors.division = "Division is required.";
    }

    if (!form.district) {
      newErrors.district = "District is required.";
    }

    if (!form.upazila) {
      newErrors.upazila = "Upazila is required.";
    }

    if (!form.union) {
      newErrors.union = "Union is required.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (passwordStrength.score < 4) {
      newErrors.password = "Password must include uppercase, lowercase, number and special character.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to Terms and Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");
      toast.loading("Creating your account...");

      const avatarUrl = avatarFile ? await uploadService.uploadAvatar(avatarFile) : "";

      const payload = {
        ...form,
        avatar: avatarUrl,
        role: "donor",
        status: "active"
      };

      await register(payload);
      // toast.dismiss();
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.dismiss();
      const errorMsg = error.message || error.response?.data?.message || "Registration failed. Please try again.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] px-3 py-6 sm:px-6 lg:px-8">
      {notificationState.visible ? (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          {notificationState.message}
        </div>
      ) : null}

      <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[40%_60%]">
        <aside className="relative hidden bg-linear-to-b from-white to-rose-50 p-8 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <FiDroplet className="text-xl" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Blood<span className="text-[#DC2626]">Donor</span>
              </h2>
              <p className="text-sm text-slate-500">Be a hero. Save a life.</p>
            </div>
          </div>

          <h3 className="text-5xl font-black leading-tight text-slate-900">
            Every Drop Counts,
            <span className="block text-[#DC2626]">Every Donor Matters.</span>
          </h3>
          <p className="mt-4 max-w-sm text-slate-600">
            Join our community of life savers and make a real difference.
          </p>

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-red-100 bg-white p-4 shadow-xl">
            <Image src={bannerImage} alt="Blood donation" className="h-auto w-full rounded-2xl object-cover" priority />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[{
              label: "Active Donors",
              value: "12,500+",
              icon: <FiUsers />
            }, {
              label: "Donation Requests",
              value: "8,430+",
              icon: <FiDroplet />
            }, {
              label: "District Coverage",
              value: "64",
              icon: <HiOutlineBuildingOffice2 />
            }, {
              label: "Lives Saved",
              value: "45,000+",
              icon: <FiHeart />
            }].map((item) => (
              <div key={item.label} className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
                <div className="text-lg text-[#DC2626]">{item.icon}</div>
                <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <FiShield className="mt-1 text-xl text-[#DC2626]" />
              <div>
                <p className="font-bold text-[#DC2626]">Your Information is Safe</p>
                <p className="text-sm text-slate-600">We ensure the highest level of security for your personal data.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Together, we can build a healthier tomorrow.
          </div>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-2xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#DC2626] text-white shadow-lg">
                <FiUser />
              </div>
              <h1 className="mt-4 text-4xl font-black text-slate-900">Create an Account</h1>
              <p className="mt-2 text-slate-500">Join us and start saving lives today!</p>
            </div>

            <div className="mt-8 grid grid-cols-3 items-center text-center text-xs font-semibold uppercase tracking-wide">
              {["Personal Info", "Location", "Security"].map((step, index) => (
                <div key={step} className="relative">
                  <div className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full border ${index === 0 ? "border-[#DC2626] bg-[#DC2626] text-white" : "border-slate-300 bg-white text-slate-500"}`}>
                    {index + 1}
                  </div>
                  <p className={index === 0 ? "text-[#DC2626]" : "text-slate-500"}>{step}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {apiError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>
              ) : null}

              <div className="space-y-4">
                <h3 className="border-b border-red-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#DC2626]">Personal Information</h3>

                <FloatingInput
                  label="Full Name"
                  icon={<FiUser />}
                  name="name"
                  value={form.name}
                  onChange={handleTextChange}
                  error={errors.name}
                  disabled={isSubmitting}
                  autoComplete="name"
                />

                <FloatingInput
                  label="Email Address"
                  icon={<FiMail />}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleTextChange}
                  error={errors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Avatar</label>
                  <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
                    <label className="flex h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-3 transition hover:bg-red-100">
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isSubmitting}
                      />
                      <div className="text-center">
                        <FiImage className="mx-auto text-2xl text-[#DC2626]" />
                        <p className="mt-1 text-sm font-semibold text-[#DC2626]">Upload Image</p>
                        <p className="text-xs text-slate-500">JPG, PNG up to 2MB</p>
                      </div>
                    </label>

                    <div className="flex items-center justify-center rounded-full border border-red-100 bg-white">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          width={84}
                          height={84}
                          className="h-20 w-20 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <FiUser className="text-3xl" />
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.avatar ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <FiAlertCircle className="text-sm" /> {errors.avatar}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Blood Group</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <FiDroplet />
                    </span>
                    <select
                      value={form.bloodGroup}
                      onChange={handleBloodGroupChange}
                      disabled={isSubmitting}
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition ${
                        errors.bloodGroup ? "border-red-400 focus:border-red-500" : "border-red-100 focus:border-red-500"
                      }`}
                    >
                      <option value="">Select your blood group</option>
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.bloodGroup ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <FiAlertCircle className="text-sm" /> {errors.bloodGroup}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-red-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#DC2626]">Location Information</h3>

                <SelectField
                  label="Division"
                  icon={<FiMap />}
                  name="division"
                  value={selectedIds.divisionId}
                  options={divisions}
                  onChange={handleDivisionChange}
                  error={errors.division}
                  disabled={isSubmitting || locationLoading.divisions}
                  placeholder={locationLoading.divisions ? "Loading divisions..." : "Select division"}
                />

                <SelectField
                  label="District"
                  icon={<HiOutlineBuildingOffice2 />}
                  name="district"
                  value={selectedIds.districtId}
                  options={districts}
                  onChange={handleDistrictChange}
                  error={errors.district}
                  disabled={isSubmitting || !selectedIds.divisionId || locationLoading.districts}
                  placeholder={locationLoading.districts ? "Loading districts..." : "Select district"}
                />

                <SelectField
                  label="Upazila"
                  icon={<FiMapPin />}
                  name="upazila"
                  value={selectedIds.upazilaId}
                  options={upazilas}
                  onChange={handleUpazilaChange}
                  error={errors.upazila}
                  disabled={isSubmitting || !selectedIds.districtId || locationLoading.upazilas}
                  placeholder={locationLoading.upazilas ? "Loading upazilas..." : "Select upazila"}
                />

                <SelectField
                  label="Union"
                  icon={<FiFlag />}
                  name="union"
                  value={selectedIds.unionId}
                  options={unions}
                  onChange={handleUnionChange}
                  error={errors.union}
                  disabled={isSubmitting || !selectedIds.upazilaId || locationLoading.unions}
                  placeholder={locationLoading.unions ? "Loading unions..." : "Select union"}
                />
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-red-100 pb-2 text-sm font-bold uppercase tracking-wide text-[#DC2626]">Security Information</h3>

                <FloatingInput
                  label="Password"
                  icon={<FiLock />}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleTextChange}
                  error={errors.password}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="transition hover:text-[#DC2626]"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Password strength</span>
                    <span className="font-bold text-[#DC2626]">{passwordStrength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((bar) => (
                      <div key={bar} className="h-1.5 rounded-full bg-slate-200">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${bar <= passwordStrength.score ? passwordStrength.color : "bg-slate-200"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <FloatingInput
                  label="Confirm Password"
                  icon={<FiLock />}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleTextChange}
                  error={errors.confirmPassword}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="transition hover:text-[#DC2626]"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                />
              </div>

              <div>
                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(event) => {
                      setAgreedToTerms(event.target.checked);
                      setErrors((prev) => ({ ...prev, terms: "" }));
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-red-300 text-[#DC2626]"
                    disabled={isSubmitting}
                  />
                  <span>
                    I agree to the <Link href="/terms" className="font-semibold text-[#DC2626]">Terms & Conditions</Link> and <Link href="/privacy" className="font-semibold text-[#DC2626]">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms ? (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <FiAlertCircle className="text-sm" /> {errors.terms}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiHeart />
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-red-100" />
                or
                <span className="h-px flex-1 bg-red-100" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#DC2626] hover:text-[#B91C1C]">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
