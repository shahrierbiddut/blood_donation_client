// src/Components/ProtectedRoute.js
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@heroui/react";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Check role if required
  if (requiredRole && user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return children;
}
