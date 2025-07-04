"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Input from "@/components/common/Input"
import { Badge } from "@/components/common/Badge"
import { Edit, Save, X } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchStudents } from "@/store/features/studentSlice"
import { fetchCourses } from "@/store/features/courseSlice"
import { fetchGrades, updateGrade } from "@/store/features/gradesSlice"
import api from "@/helper/axios"
import Toast from "@/components/common/Toast"
import AssignStudentForm from "@/components/faculty/AssignStudentForm"
import GradeManagementTable from "@/components/faculty/GradeManagementTable"
import { IGrade } from "@/store/types"

export default function FacultyPanel() {
    const dispatch = useAppDispatch();
    const [selectedStudent, setSelectedStudent] = useState("")
    const [selectedCourse, setSelectedCourse] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [editingGrade, setEditingGrade] = useState<string | number | null>(null)
    const [activeTab, setActiveTab] = useState<'assign' | 'grades'>('assign')
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

    const students = useAppSelector(state => state.students.list);
    const courses = useAppSelector(state => state.courses.list);
    const grades = useAppSelector(state => state.grades.list);

    useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchCourses());
        dispatch(fetchGrades());
    }, [dispatch]);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAssignStudent = async () => {
        if (selectedStudent && selectedCourse) {
            const student = students.find(s => s.id === selectedStudent);
            const course = courses.find(c => c.id === selectedCourse);
            if (!student || !course) return;

           
            const alreadyAssigned = grades.some(
                g => g.studentId === student.id && g.courseId === course.id
            );
            if (alreadyAssigned) {
                setToast({ message: "Student is already assigned to this course.", type: "error" });
                return;
            }

            const newGrade = {
                id: Date.now().toString(),
                studentId: student.id,
                courseId: course.id,
                midterm: 0,
                final: 0,
                assignments: 0,
                overall: ""
            };

            try {
                await api.post("/grades", newGrade);

                
                const newEnrolledCourses = Array.isArray(student.enrolledCourses)
                    ? [...student.enrolledCourses, {
                        id: course.id,
                        name: course.name,
                        code: course.code,
                        credits: 3,
                        grade: "",
                        progress: 0
                    }]
                    : [{
                        id: course.id,
                        name: course.name,
                        code: course.code,
                        credits: 3,
                        grade: "",
                        progress: 0
                    }];
                await api.patch(`/students/${student.id}`, { enrolledCourses: newEnrolledCourses });

                
                const newEnrollmentCount = (course.enrollmentCount || 0) + 1;
                await api.patch(`/courses/${course.id}`, { enrollmentCount: newEnrollmentCount });

                dispatch(fetchGrades());
                dispatch(fetchStudents());
                dispatch(fetchCourses());
                setSelectedStudent("");
                setSelectedCourse("");
                setToast({ message: "Student assigned to course successfully!", type: "success" });
            } catch (error) {
                console.error("Failed to assign student to course:", error);
                setToast({ message: "Failed to assign student to course.", type: "error" });
            }
        }
    }

    const [gradeDraft, setGradeDraft] = useState<any>({});

    const handleGradeEdit = (id: string | number, field: string, value: string) => {
        setGradeDraft((prev: any) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSaveGrade = (id: string | number) => {
        const original = grades.find(g => String(g.id) === String(id));
        if (!original) return;
        const updated = { ...original, ...gradeDraft[id] };
        dispatch(updateGrade(updated));
        setEditingGrade(null);
        setGradeDraft((prev: any) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });

       
        const student = students.find(s => s.id === updated.studentId);
        if (student && Array.isArray(student.enrolledCourses)) {
            const updatedCourses = student.enrolledCourses.map((course: any) =>
                course && typeof course === "object" && "id" in course
                    ? (String(course.id) === String(updated.courseId)
                        ? { ...course, grade: updated.overall }
                        : course)
                    : course
            );
            api.patch(`/students/${student.id}`, { enrolledCourses: updatedCourses });
            dispatch(fetchStudents());
        }
    };

    const getGradeColor = (grade: string) => {
        if (grade.startsWith("A")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }


    const gradeColumns: import("@/components/common/Table").TableColumn<IGrade>[] = [
        {
            title: "Student",
            dataIndex: (row: IGrade) => {
                const student = students.find(s => s.id === row.studentId);
                return student ? student.name : row.studentId;
            }
        },
        {
            title: "Course",
            dataIndex: (row: IGrade) => {
                const course = courses.find(c => c.id === row.courseId);
                return course ? course.name : row.courseId;
            }
        },
        {
            title: "Midterm", dataIndex: (row: any) => editingGrade === row.id ? (
                <Input
                    type="number"
                    value={gradeDraft[row.id]?.midterm ?? row.midterm}
                    onChange={e => handleGradeEdit(row.id, "midterm", e.target.value)}
                    className="w-16"
                    min="0"
                    max="100"
                />
            ) : row.midterm
        },
        {
            title: "Final", dataIndex: (row: any) => editingGrade === row.id ? (
                <Input
                    type="number"
                    value={gradeDraft[row.id]?.final ?? row.final}
                    onChange={e => handleGradeEdit(row.id, "final", e.target.value)}
                    className="w-16"
                    min="0"
                    max="100"
                />
            ) : row.final
        },
        {
            title: "Assignments", dataIndex: (row: any) => editingGrade === row.id ? (
                <Input
                    type="number"
                    value={gradeDraft[row.id]?.assignments ?? row.assignments}
                    onChange={e => handleGradeEdit(row.id, "assignments", e.target.value)}
                    className="w-16"
                    min="0"
                    max="100"
                />
            ) : row.assignments
        },
        { title: "Overall Grade", dataIndex: (row: any) => <Badge className={getGradeColor(row.overall)}>{row.overall}</Badge> },
        {
            title: "Actions", dataIndex: (row: any) => (
                <div className="flex gap-2">
                    {editingGrade === row.id ? (
                        <>
                            <Button onClick={() => handleSaveGrade(row.id)}>
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => setEditingGrade(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditingGrade(row.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        },
    ]

    
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className="space-y-6">
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Faculty Panel</h2>
                <p className="text-muted-foreground">Manage student assignments and grades</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${activeTab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('assign')}
                    >
                        Assign Students
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${activeTab === 'grades' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('grades')}
                    >
                        Manage Grades
                    </button>
                </div>

                {activeTab === 'assign' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Assign Students to Courses</CardTitle>
                            <CardDescription>Select a student and course to create new enrollment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AssignStudentForm
                                students={students}
                                courses={courses}
                                filteredStudents={filteredStudents}
                                selectedStudent={selectedStudent}
                                setSelectedStudent={setSelectedStudent}
                                selectedCourse={selectedCourse}
                                setSelectedCourse={setSelectedCourse}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                handleAssignStudent={handleAssignStudent}
                            />
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'grades' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Grade Management</CardTitle>
                            <CardDescription>Edit and update student grades for your courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GradeManagementTable
                                grades={grades}
                                students={students}
                                courses={courses}
                                editingGrade={editingGrade}
                                setEditingGrade={setEditingGrade}
                                gradeDraft={gradeDraft}
                                handleGradeEdit={handleGradeEdit}
                                handleSaveGrade={handleSaveGrade}
                                getGradeColor={getGradeColor}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
