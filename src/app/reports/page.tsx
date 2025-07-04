"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import { Badge } from "@/components/common/Badge"
import { Download, TrendingUp, Users, BookOpen, Award } from "lucide-react"
import dynamic from "next/dynamic"
import { useIsDarkMode } from "@/lib/utils"
import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchReports } from "@/store/features/reportSlice"
import { IEnrollmentReport, ITopStudentReport } from "@/store/types"
import Table from "@/components/common/Table"
import SummaryStats from "@/components/reports/SummaryStats"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

const ReportsPage = () => {
    const dispatch = useAppDispatch();
    const { data: reportData, status, error } = useAppSelector((state) => state.reports);
    useEffect(() => { dispatch(fetchReports()); }, [dispatch]);

    function isEnrollmentReport(r: any): r is IEnrollmentReport {
        return Array.isArray(r?.enrollmentsOverTime);
    }
    function isTopStudentReport(r: any): r is ITopStudentReport {
        return Array.isArray(r?.topStudents);
    }
    const enrollmentReports = useMemo(() => Array.isArray(reportData) ? reportData.filter(isEnrollmentReport) : [], [reportData]);
    const topStudentReports = useMemo(() => Array.isArray(reportData) ? reportData.filter(isTopStudentReport) : [], [reportData]);


    const months = useMemo(() => {
        const allMonths = new Set<string>();
        enrollmentReports.forEach((report) => {
            report.enrollmentsOverTime.forEach((e: any) => allMonths.add(e.date));
        });
        return Array.from(allMonths).sort();
    }, [enrollmentReports]);

    const enrollmentTrendsSeries = useMemo(() => enrollmentReports.map((report) => ({
        name: report.courseName,
        data: months.map((month) => {
            const found = report.enrollmentsOverTime.find((e) => e.date === month);
            return found ? found.count : 0;
        })
    })), [enrollmentReports, months]);

    const isDark = useIsDarkMode();
    const mode: "dark" | "light" = isDark ? "dark" : "light";

    const enrollmentTrendsOptions = {
        chart: {
            type: "line" as const,
            height: 400,
            toolbar: { show: false },
        },
        stroke: {
            width: 3,
            curve: "smooth" as const,
        },
        xaxis: {
            categories: months,
            title: { text: "Month" },
            labels: { style: { colors: isDark ? '#ededed' : '#171717' } },
        },
        yaxis: {
            title: { text: "Enrollments" },
            min: 0,
            labels: { style: { colors: isDark ? '#ededed' : '#171717' } },
        },
        legend: {
            show: true,
            position: "top" as const,
            labels: { colors: isDark ? '#ededed' : '#171717' },
        },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        tooltip: {
            theme: mode,
        },
        grid: {
            borderColor: isDark ? "#334155" : "#e5e7eb",
        },
        theme: { mode },
    };

    const handleExportCSV = () => {

        const csvContent = [
            ["Course", "Student Name", "GPA"],
            ...topStudentReports.flatMap((course) =>
                course.topStudents.map((student) => [course.courseName, student.name, student.gpa]),
            ),
        ]
            .map((row) => row.join(","))
            .join("\n")


        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "academic-report.csv"
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const getGPAColor = (gpa: number) => {
        if (gpa >= 3.8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        if (gpa >= 3.5) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        if (gpa >= 3.0) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }

    const totalEnrollments = useMemo(() => {
        return enrollmentReports.reduce(
            (sum, report) =>
                sum +
                report.enrollmentsOverTime.reduce((s, e) => s + (e.count || 0), 0),
            0
        );
    }, [enrollmentReports]);

    const activeCourses = useMemo(() => enrollmentReports.length, [enrollmentReports]);

    const allTopStudents = useMemo(
        () => topStudentReports.flatMap((r) => r.topStudents),
        [topStudentReports]
    );

    const averageGPA = useMemo(() => {
        if (allTopStudents.length === 0) return 0;
        const total = allTopStudents.reduce((sum, s) => sum + (s.gpa || 0), 0);
        return total / allTopStudents.length;
    }, [allTopStudents]);

    const completionRate = useMemo(() => {

        if (allTopStudents.length === 0) return 0;
        const completed = allTopStudents.filter((s) => s.gpa >= 3.0).length;
        return (completed / allTopStudents.length) * 100;
    }, [allTopStudents]);

    const summaryStats = [
        {
            title: "Total Enrollments",
            value: totalEnrollments.toLocaleString(),
            change: "+12.5%",
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Active Courses",
            value: activeCourses.toString(),
            change: "+3 new",
            icon: BookOpen,
            color: "text-green-600",
        },
        {
            title: "Average GPA",
            value: averageGPA ? averageGPA.toFixed(2) : "N/A",
            change: "+0.08",
            icon: Award,
            color: "text-purple-600",
        },
        {
            title: "Completion Rate",
            value: `${completionRate.toFixed(1)}%`,
            change: "+2.1%",
            icon: TrendingUp,
            color: "text-orange-600",
        },
    ];

    if (status === 'loading') return <div className="text-center py-12">Loading reports...</div>;
    if (status === 'failed') return <div className="text-center py-12 text-red-500">Failed to load reports: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                    <p className="text-muted-foreground">Academic performance analytics and insights</p>
                </div>
                <Button onClick={handleExportCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <SummaryStats stats={summaryStats} />

            <Card>
                <CardHeader>
                    <CardTitle>Course Enrollment Trends</CardTitle>
                    <CardDescription>Monthly enrollment numbers across different departments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ width: "100%", height: 400 }}>
                        <ReactApexChart
                            options={enrollmentTrendsOptions}
                            series={enrollmentTrendsSeries}
                            type="line"
                            height={400}
                        />
                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Students by Course</CardTitle>
                    <CardDescription>Highest GPA students in each department</CardDescription>
                </CardHeader>
                <CardContent className="">
                    <div className="space-y-6">
                        {topStudentReports.map((course) => (
                            <div key={course.courseName} className="space-y-3">
                                <h4 className="font-semibold text-lg">{course.courseName}</h4>
                                <div className="rounded-md border border-border/50 bg-background">
                                    <Table
                                        columns={[
                                            {
                                                title: "Rank",
                                                dataIndex: (_row, i) => (
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">{i + 1}</div>
                                                ),
                                            },
                                            { title: "Student Name", dataIndex: "name" },
                                            {
                                                title: "GPA",
                                                dataIndex: (row) => (
                                                    <Badge className={getGPAColor(row.gpa)}>{row.gpa.toFixed(2)}</Badge>
                                                ),
                                            },
                                        ]}
                                        data={course.topStudents}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ReportsPage;
