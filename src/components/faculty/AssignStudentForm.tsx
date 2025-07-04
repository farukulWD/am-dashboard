import React from "react";
import Label from "@/components/common/Label";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface AssignStudentFormProps {
  students: any[];
  courses: any[];
  filteredStudents: any[];
  selectedStudent: string;
  setSelectedStudent: (id: string) => void;
  selectedCourse: string;
  setSelectedCourse: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleAssignStudent: () => void;
  loading?: boolean;
}

const AssignStudentForm: React.FC<AssignStudentFormProps> = ({
  filteredStudents,
  selectedStudent,
  setSelectedStudent,
  selectedCourse,
  setSelectedCourse,
  searchTerm,
  setSearchTerm,
  handleAssignStudent,
  courses,
  loading
}) => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="student-select">Select Student</Label>
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            id="student-select"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            options={filteredStudents.map(student => ({
              value: student.id.toString(),
              label: student.name
            }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="course-select">Select Course</Label>
        <Select
          id="course-select"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          options={courses.map(course => ({
            value: course.id.toString(),
            label: `${course.code} - ${course.name}`
          }))}
        />
      </div>
    </div>
    <Button
      onClick={handleAssignStudent}
      disabled={!selectedStudent || !selectedCourse || loading}
      className="w-full md:w-auto"
    >
      <UserPlus className="mr-2 h-4 w-4" />
      Assign Student to Course
    </Button>
  </div>
);

export default AssignStudentForm; 