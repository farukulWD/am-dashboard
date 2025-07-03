"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Table from "@/components/common/Table";
import { motion } from "framer-motion";
import api from "@/helper/axios";

interface Student {
  id: string;
  name: string;
  email: string;
  year: number;
  gpa: number;
  enrolledCourses?: string[];
  course?: string;
}

const yearLabels = ["Freshman", "Sophomore", "Junior", "Senior"];

export default function StudentsPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    api.get("/students")
      .then((res) => {
        setStudentsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch students");
        setLoading(false);
      });
  }, []);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || (student.course === courseFilter || (student.enrolledCourses && student.enrolledCourses.includes(courseFilter)));
    const matchesYear =
      yearFilter === "all" || yearLabels[student.year - 1] === yearFilter;
    return matchesSearch && matchesCourse && matchesYear;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getGPABadgeColor = (gpa: number) => {
    if (gpa >= 3.8) return "bg-green-100 text-green-800";
    if (gpa >= 3.5) return "bg-blue-100 text-blue-800";
    if (gpa >= 3.0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-background w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <p className="text-gray-500">Manage and view all student information</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="py-4 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="pl-10 pr-4 py-2"
            />
          </div>
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="sm:w-[180px]"
            options={[
              { label: "All Courses", value: "all" },
              { label: "Computer Science", value: "Computer Science" },
              { label: "Mathematics", value: "Mathematics" },
              { label: "Physics", value: "Physics" },
              { label: "Chemistry", value: "Chemistry" },
              { label: "Biology", value: "Biology" },
            ]}
          />
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="sm:w-[180px]"
            options={[
              { label: "All Years", value: "all" },
              { label: "Freshman", value: "Freshman" },
              { label: "Sophomore", value: "Sophomore" },
              { label: "Junior", value: "Junior" },
              { label: "Senior", value: "Senior" },
            ]}
          />
        </div>

        {/* Table for desktop, hidden on mobile */}
        <div className="hidden md:block">
          <Table
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              { title: "Year", dataIndex: (student) => (
                <span className="inline-block px-2 py-1 rounded border text-xs text-gray-700">{yearLabels[student.year - 1]}</span>
              ) },
              { title: "GPA", dataIndex: (student) => (
                <span className={`inline-block px-2 py-1 rounded text-xs ${getGPABadgeColor(student.gpa)}`}>{student.gpa.toFixed(2)}</span>
              ) },
              { title: "Actions", dataIndex: (student) => (
                <Link href={`/students/${student.id}`} className="inline-block">
                  <button className="px-3 py-1 text-sm border border-border rounded hover:bg-muted cursor-pointer">View Profile</button>
                </Link>
              ) },
            ]}
            data={paginatedStudents}
            rowProps={(_row, i) => ({
              as: motion.tr,
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 * i, duration: 0.4 },
            })}
          />
        </div>

        {/* Card layout for mobile, hidden on md+ */}
        <div className="md:hidden space-y-4">
          {paginatedStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="border border-border/50 rounded-md p-4 flex flex-col gap-2 bg-background"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base text-foreground">{student.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${getGPABadgeColor(student.gpa)}`}>{student.gpa.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">{student.email}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block px-2 py-1 rounded border text-xs text-gray-700">{yearLabels[student.year - 1]}</span>
                {/* You can add course info here if needed */}
              </div>
              <div className="mt-3">
                <Link href={`/students/${student.id}`} className="inline-block w-full">
                  <button className="w-full px-3 py-2 text-sm border border-border rounded hover:bg-gray-100">View Profile</button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  );
}
