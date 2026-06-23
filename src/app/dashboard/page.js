"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function DashboardRoleRouter() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?.role) return;

    if (user.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    router.replace("/dashboard/user");
  }, [loading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" color="danger" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardRoleRouter />
    </ProtectedRoute>
  );
}
