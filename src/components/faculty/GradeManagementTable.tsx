import React from "react";
import Table from "@/components/common/Table";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Edit, Save, X } from "lucide-react";

interface GradeManagementTableProps {
  grades: any[];
  students: any[];
  courses: any[];
  editingGrade: string | number | null;
  setEditingGrade: (id: string | number | null) => void;
  gradeDraft: any;
  handleGradeEdit: (id: string | number, field: string, value: string) => void;
  handleSaveGrade: (id: string | number) => void;
  getGradeColor: (grade: string) => string;
}

const GradeManagementTable: React.FC<GradeManagementTableProps> = ({
  grades,
  students,
  courses,
  editingGrade,
  setEditingGrade,
  gradeDraft,
  handleGradeEdit,
  handleSaveGrade,
  getGradeColor
}) => {
  const gradeColumns = [
    {
      title: "Student",
      dataIndex: (row: any) => {
        const student = students.find(s => s.id === row.studentId);
        return student ? student.name : row.studentId;
      }
    },
    {
      title: "Course",
      dataIndex: (row: any) => {
        const course = courses.find(c => c.id === row.courseId);
        return course ? course.name : row.courseId;
      }
    },
    {
      title: "Midterm",
      dataIndex: (row: any) => editingGrade === row.id ? (
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
      title: "Final",
      dataIndex: (row: any) => editingGrade === row.id ? (
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
      title: "Assignments",
      dataIndex: (row: any) => editingGrade === row.id ? (
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
    {
      title: "Overall Grade",
      dataIndex: (row: any) => <Badge className={getGradeColor(row.overall)}>{row.overall}</Badge>
    },
    {
      title: "Actions",
      dataIndex: (row: any) => (
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
    }
  ];

  return (
    <div className="rounded-md border border-border/50">
      <Table columns={gradeColumns} data={grades} />
    </div>
  );
};

export default GradeManagementTable; 