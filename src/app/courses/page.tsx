"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Badge } from "@/components/common/Badge";
import Table from "@/components/common/Table";
import { Search, Plus, Users, BookOpen } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCourses } from "@/store/features/courseSlice";
import { fetchFaculty } from "@/store/features/facultySlice";
import Modal from "@/components/common/Modal";
import CourseForm, { CourseFormValues } from "./CourseForm";
import api from "@/helper/axios";
import Toast from "@/components/common/Toast";
import { motion } from "framer-motion";
import { ICourse, IFaculty } from "@/store/types";

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { list: courses, status: coursesStatus } = useAppSelector(
    (state) => state.courses
  );
  const { list: faculty } = useAppSelector((state) => state.faculty);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchFaculty());
  }, [dispatch]);

  const getFacultyName = (facultyId: string) => {
    const f = faculty.find((f) => f.id === facultyId);
    return f ? f.name : "-";
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCourses = courses.filter(
    (course) =>
      (course.name &&
        course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.code &&
        course.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getFacultyName(course.facultyId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Full":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getEnrollmentColor = (enrollment: number, capacity: number) => {
    const percentage = capacity > 0 ? (enrollment / capacity) * 100 : 0;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getCourseStatus = (course: ICourse) => {
    if (typeof course.enrollmentCount === "number") {
      if (course.enrollmentCount >= 40) return "Full";

      return "Active";
    }
    return "-";
  };

  const getCourseCapacity = (course: ICourse) => {
    return typeof course.capacity === "number" ? course.capacity : 40;
  };

  const columns = [
    {
      title: "Course",
      dataIndex: (row: ICourse) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.code}</div>
        </div>
      ),
    },
    {
      title: "Faculty",
      dataIndex: (row: ICourse) => getFacultyName(row.facultyId),
    },
    {
      title: "Enrollment",
      dataIndex: (row: ICourse) => (
        <span
          className={getEnrollmentColor(
            row.enrollmentCount,
            getCourseCapacity(row)
          )}
        >
          {row.enrollmentCount}/{getCourseCapacity(row)}
        </span>
      ),
    },
    { title: "Year", dataIndex: (row: ICourse) => row.year ?? "-" },
    {
      title: "Status",
      dataIndex: (row: ICourse) => (
        <Badge className={getStatusColor(getCourseStatus(row))}>
          {getCourseStatus(row)}
        </Badge>
      ),
    },
    {
      title: "Actions",
      dataIndex: (row: ICourse) => (
        <Button
          className="bg-transparent border border-border/50 text-muted-foreground hover:bg-gray-100 hover:text-blue-600 px-2 py-1 text-xs"
          onClick={() => openEditModal(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCourse(null);
    setModalOpen(true);
  };
  const openEditModal = (course: ICourse) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCourseFormSubmit = async (values: CourseFormValues) => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (modalMode === "add") {
        await api.post("/courses", values);
      } else if (modalMode === "edit" && selectedCourse) {
        await api.patch(`/courses/${selectedCourse.id}`, values);
      }
      await dispatch(fetchCourses());
      setModalOpen(false);
      setSelectedCourse(null);
      setCurrentPage(1);
      setToast({
        message:
          modalMode === "add"
            ? "Course added successfully!"
            : "Course updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to save course.");
      setToast({
        message: err?.response?.data?.message || "Failed to save course.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (coursesStatus === "loading") {
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

  const showEmptyState = filteredCourses.length === 0;

  return (
    <div className="bg-background w-full space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === "add" ? "Add Course" : "Edit Course"}
      >
        {formError && (
          <div className="mb-2 text-red-500 text-sm">{formError}</div>
        )}
        <CourseForm
          initialValues={
            modalMode === "edit" && selectedCourse
              ? {
                  name: selectedCourse.name,
                  code: selectedCourse.code,
                  facultyId: selectedCourse.facultyId,
                  year: selectedCourse.year,
                  capacity: selectedCourse.capacity ?? 40,
                }
              : {}
          }
          onSubmit={handleCourseFormSubmit}
          onCancel={closeModal}
          faculty={faculty}
          isLoading={formLoading}
        />
      </Modal>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-gray-500">
            Manage course offerings and enrollments
          </p>
        </div>
        <Button
          className=" text-white  hover:text-white"
          onClick={openAddModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10 pr-4 py-2"
          />
        </div>
        <div className="flex gap-2">
          <Button
            className={
              viewMode === "table"
                ? ""
                : "border hover:text-white border-border/50 bg-white text-gray-700"
            }
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
          <Button
            className={
              viewMode === "cards"
                ? ""
                : "border hover:text-white border-border/50 bg-white text-gray-700"
            }
            onClick={() => setViewMode("cards")}
          >
            Card View
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" &&
        (showEmptyState ? (
          <div className="py-12 text-center text-muted-foreground">
            No courses found.
          </div>
        ) : (
          <>
            <Table columns={columns} data={paginatedCourses} />
            <div className="pt-2 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ))}

      {/* Card View */}
      {viewMode === "cards" &&
        (showEmptyState ? (
          <div className="py-12 text-center text-muted-foreground">
            No courses found.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>{course.code}</CardDescription>
                      </div>
                      <Badge
                        className={getStatusColor(getCourseStatus(course))}
                      >
                        {getCourseStatus(course)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Faculty: {getFacultyName(course.facultyId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>Year: {course.year ?? "-"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">Enrollment: </span>
                        <span
                          className={getEnrollmentColor(
                            course.enrollmentCount,
                            getCourseCapacity(course)
                          )}
                        >
                          {course.enrollmentCount}/{getCourseCapacity(course)}
                        </span>
                      </div>
                      <Button
                        className="bg-transparent border border-border/50 text-muted-foreground hover:text-blue-600 hover:bg-gray-100 px-2 py-1 text-xs"
                        onClick={() => openEditModal(course)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="pt-2 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ))}
    </div>
  );
}
