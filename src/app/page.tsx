"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import SummaryCards from "../componets/dashboard/SummaryCards";
import CourseEnrollmentChart from "../componets/dashboard/CourseEnrollmentChart";
import TopStudentsTable from "../componets/dashboard/TopStudentsTable";

export default function Home() {
  const summary = [
    { label: "Total Students", value: 1200 },
    { label: "Total Courses", value: 35 },
    { label: "Total Faculty", value: 18 },
  ];

  const courseEnrollmentData = useMemo(
    () => ({
      series: [
        {
          name: "Enrollments",
          data: [120, 98, 85, 70, 65, 60, 55],
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
          categories: [
            "Math",
            "Physics",
            "Chemistry",
            "Biology",
            "History",
            "English",
            "Art",
          ],
          labels: { style: { fontSize: "14px" } },
        },
        yaxis: {
          title: { text: "Students" },
          labels: { style: { fontSize: "14px" } },
        },
        colors: ["#2563eb"],
        grid: { borderColor: "#e5e7eb" },
      },
    }),
    []
  );

  // Mock data for top students
  const topStudents = [
    { name: "Alice Johnson", gpa: 4.0 },
    { name: "Bob Smith", gpa: 3.95 },
    { name: "Carol Lee", gpa: 3.92 },
    { name: "David Kim", gpa: 3.89 },
    { name: "Eva Brown", gpa: 3.85 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
      >
        Academic Management Dashboard
      </motion.h1>

      <SummaryCards summary={summary} />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className=" mx-auto grid md:grid-cols-2 gap-8"
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
