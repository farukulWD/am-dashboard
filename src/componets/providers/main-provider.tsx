"use client";
import DashboardLayout from "../dashboard/DashboardLayout";

interface MainProviderProps {
  children: React.ReactNode;
}

export default function MainProvider({ children }: MainProviderProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
