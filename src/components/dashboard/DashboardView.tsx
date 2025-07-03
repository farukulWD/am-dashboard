"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import SummaryCards from "./SummaryCards";
import CourseEnrollmentChart from "./CourseEnrollmentChart";
import TopStudentsTable from "./TopStudentsTable";

import { IDashboardSummary } from "@/store/types";
interface Props {
  dashboard: IDashboardSummary;
}
export default function DashboardView({ dashboard }: Props) {
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

  return (
    <main
      className="min-h-screen p-4"
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
