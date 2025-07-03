"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import SummaryCards from "../componets/dashboard/SummaryCards";
import CourseEnrollmentChart from "../componets/dashboard/CourseEnrollmentChart";
import TopStudentsTable from "../componets/dashboard/TopStudentsTable";

import { fetchDashboard } from "../store/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Home() {
  const dispatch = useAppDispatch();
  const { summary: dashboard, status } = useAppSelector(
    (state) => state.dashboard
  );

  

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const summary = useMemo(() => {
    if (!dashboard) return [];
    return [
      { label: "Total Students", value: dashboard.totalStudents },
      { label: "Total Courses", value: dashboard.totalCourses },
      { label: "Total Faculty", value: dashboard.totalFaculty },
    ];
  }, [dashboard]);

  const courseEnrollmentData = useMemo(() => {
    if (!dashboard || !dashboard.popularCourses)
      return { series: [], options: {} };
    return {
      series: [
        {
          name: "Enrollments",
          data: dashboard.popularCourses.map((c) => c.enrollmentCount),
        },
      ],
      options: {
        chart: {
          type: "bar" as const,
          height: 300,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: false,
            columnWidth: "50%",
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: dashboard.popularCourses.map((c) => c.name),
          labels: { style: { fontSize: "14px" } },
        },
        yaxis: {
          title: { text: "Students" },
          labels: { style: { fontSize: "14px" } },
        },
        colors: ["#2563eb"],
        grid: { borderColor: "#e5e7eb" },
      },
    };
  }, [dashboard]);

  const topStudents = useMemo(() => {
    if (!dashboard || !dashboard.topStudents) return [];
    return dashboard.topStudents.map((s) => ({
      name: s.name,
      gpa: s.gpa,
    }));
  }, [dashboard]);

  if (status === "loading") {
    return (
      <div className="text-center mt-20" style={{ color: "var(--foreground)" }}>
        Loading...
      </div>
    );
  }

  return (
    <main
      className="min-h-screen p-6"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        style={{ color: "var(--foreground)" }}
      >
        Academic Management Dashboard
      </motion.h1>

      <SummaryCards summary={summary} />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mx-auto grid md:grid-cols-2 gap-8"
      >
        <CourseEnrollmentChart
          series={courseEnrollmentData.series}
          options={courseEnrollmentData.options}
        />
        <TopStudentsTable students={topStudents} />
      </motion.section>
    </main>
  );
}
