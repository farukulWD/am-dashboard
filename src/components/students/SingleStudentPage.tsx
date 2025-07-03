"use client";
import React, { useState, useEffect } from "react";
import Table from "@/components/common/Table";
import api from "@/helper/axios";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useIsDarkMode } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Types
interface Course {
    id: string;
    name: string;
    code: string;
    credits: number;
    grade: string;
    progress: number;
}

interface GradeHistory {
    semester: string;
    gpa: number;
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    course: string;
    year: string;
    gpa: number;
    avatar: string;
    enrolledCourses: Course[];
    gradeHistory: GradeHistory[];
}

const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
};

const columns: import("@/components/common/Table").TableColumn<Course>[] = [
    { title: "Course Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "Credits", dataIndex: "credits" },
    {
        title: "Current Grade",
        dataIndex: (row: Course) => (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(row.grade)}`}>{row.grade}</span>
        ),
    },
    {
        title: "Progress",
        dataIndex: (row: Course) => (
            <div className="flex items-center gap-2 min-w-[120px]">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${row.progress}%` }}
                    ></div>
                </div>
                <span className="text-xs text-gray-500">{row.progress}%</span>
            </div>
        ),
    },
];

export default function SingleStudentPage({ params }: { params: { studentId: string } }) {

    const [activeTab, setActiveTab] = useState("courses");
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isDark = useIsDarkMode();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching student with ID:", params.studentId);
                const response = await api.get(`/students/${params.studentId}`);
                console.log("API Response:", response.data);
                setStudent(response.data);
            } catch (err) {
                console.error("Error fetching student:", err);
                setError("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        if (params.studentId) {
            fetchStudent();
        }
    }, [params.studentId]);

    // ApexCharts configuration for GPA trend
    const gpaChartData = React.useMemo(() => {
        if (!student || !student.gradeHistory) return { series: [], options: {} };
        const mode: "dark" | "light" = isDark ? "dark" : "light";
        return {
            series: [
                {
                    name: "GPA",
                    data: student.gradeHistory.map((item) => item.gpa),
                },
            ],
            options: {
                chart: {
                    type: "bar" as const,
                    height: 200,
                    toolbar: { show: false },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 6,
                        horizontal: false,
                        columnWidth: "50%",
                    },
                },
                dataLabels: { 
                    enabled: true,
                    formatter: function(val: number) {
                        return val.toFixed(2);
                    },
                    style: {
                        fontSize: '12px',
                        colors: ['#2563eb']
                    }
                },
                xaxis: {
                    categories: student.gradeHistory.map((item) => item.semester),
                    labels: { style: { fontSize: "12px" } },
                },
                yaxis: {
                    title: { text: "GPA" },
                    min: 0,
                    max: 4,
                    labels: { style: { fontSize: "12px" } },
                },
                colors: ["#2563eb"],
                grid: { borderColor: "#e5e7eb" },
                theme: { mode },
                tooltip: { theme: mode },
            },
        };
    }, [student, isDark]);

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-32 w-32 border-b-2 border-blue-600"
                ></motion.div>
            </motion.div>
        );
    }

    if (error || !student) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center min-h-screen"
            >
                <div className="text-center">
                    <motion.h2 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-red-600 mb-2"
                    >
                        Error
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600"
                    >
                        {error || "Student not found"}
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6  p-4"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-2"
            >
                <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
                <p className="text-gray-500">Detailed information and academic progress</p>
            </motion.div>

            {/* Student Info Card */}
            <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-background border border-border/50  rounded-lg shadow p-6 flex flex-col md:flex-row gap-6"
            >
                <motion.div 
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center md:items-start"
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="h-32 w-32 rounded-full overflow-hidden border-4 border-border/50"
                    >
                        <Image
                            src={"/student.avif"}
                            alt={student.name}
                            className="object-cover w-full h-full"
                            width={128}
                            height={128}
                        />
                    </motion.div>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-center md:text-left"
                    >
                        <h3 className="text-2xl font-bold">{student.name}</h3>
                        <p className="text-gray-500">
                            {student.course} • {student.year}
                        </p>
                        <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className="inline-block mt-2 px-3 py-1 rounded bg-green-100 text-green-800 text-sm font-semibold"
                        >
                            GPA: {student.gpa.toFixed(2)}
                        </motion.span>
                    </motion.div>
                </motion.div>

                <motion.div 
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-block w-5 h-5 text-gray-400">📧</span>
                            <span className="text-sm">{student.email}</span>
                        </motion.div>
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-block w-5 h-5 text-gray-400">📞</span>
                            <span className="text-sm">{student.phone}</span>
                        </motion.div>
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.0 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-block w-5 h-5 text-gray-400">📍</span>
                            <span className="text-sm">{student.address}</span>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-block w-5 h-5 text-gray-400">🎂</span>
                            <span className="text-sm">Born: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
                        </motion.div>
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-block w-5 h-5 text-gray-400">🎓</span>
                            <span className="text-sm">Student ID: {student.id}</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 font-medium focus:outline-none transition-colors ${activeTab === "courses"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                            }`}
                        onClick={() => setActiveTab("courses")}
                    >
                        Enrolled Courses
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`ml-2 px-4 py-2 font-medium focus:outline-none transition-colors ${activeTab === "grades"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                            }`}
                        onClick={() => setActiveTab("grades")}
                    >
                        Grades & Progress
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "courses" && (
                        <motion.div
                            key="courses"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-background border border-border/50 rounded-lg shadow p-4"
                        >
                            <h4 className="text-lg font-semibold mb-2">Current Courses</h4>
                            <p className="text-gray-500 mb-4 text-sm">Courses enrolled for the current semester</p>
                            <Table columns={columns} data={student.enrolledCourses} />
                        </motion.div>
                    )}

                    {activeTab === "grades" && (
                        <motion.div
                            key="grades"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 md:grid-cols-2"
                        >
                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-background border border-border/50 rounded-lg shadow p-4"
                            >
                                <h4 className="text-lg font-semibold mb-2">GPA Trend</h4>
                                <p className="text-gray-500 mb-4 text-sm">Academic performance over time</p>
                                <div className="w-full">
                                    <ReactApexChart
                                        options={gpaChartData.options}
                                        series={gpaChartData.series}
                                        type="bar"
                                        height={200}
                                    />
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-background border border-border/50 rounded-lg shadow p-4 flex flex-col justify-between"
                            >
                                <h4 className="text-lg font-semibold mb-2">Academic Summary</h4>
                                <p className="text-gray-500 mb-4 text-sm">Overall performance metrics</p>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-3"
                                >
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-sm font-medium">Current GPA</span>
                                        <motion.span 
                                            whileHover={{ scale: 1.1 }}
                                            className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800"
                                        >
                                            {student.gpa.toFixed(2)}
                                        </motion.span>
                                    </motion.div>
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-sm font-medium">Total Credits</span>
                                        <span className="text-sm">
                                            {student.enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
                                        </span>
                                    </motion.div>
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-sm font-medium">Courses Enrolled</span>
                                        <span className="text-sm">{student.enrolledCourses.length}</span>
                                    </motion.div>
                                    <motion.div 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="flex justify-between items-center"
                                    >
                                        <span className="text-sm font-medium">Academic Standing</span>
                                        <motion.span 
                                            whileHover={{ scale: 1.1 }}
                                            className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800"
                                        >
                                            {student.gpa >= 3.5 ? "Excellent" : student.gpa >= 3.0 ? "Good" : "Needs Improvement"}
                                        </motion.span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
} 