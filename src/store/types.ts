// Student
export interface IStudent {
    id: string;
    name: string;
    email: string;
    year: number;
    gpa: number;
    enrolledCourses: string[];
}

// Course
export interface ICourse {
    id: string;
    name: string;
    code: string;
    facultyId: string;
    enrollmentCount: number;
    year: number;
}

// Faculty
export interface IFaculty {
    id: string;
    name: string;
    email: string;
    department: string;
    courses: string[];
}

// Enrollment
export interface IEnrollment {
    studentId: string;
    courseId: string;
    grade?: string;
    progress?: number;
}

// Grade
export interface IGrade {
    studentId: string;
    courseId: string;
    value: string;
    dateAssigned: string;
}

// Dashboard Summary
export interface IDashboardSummary {
    totalStudents: number;
    totalCourses: number;
    totalFaculty: number;
    topStudents: IStudent[];
    popularCourses: ICourse[];
}

// Report Types
export type TEnrollmentOverTime = {
    date: string;
    count: number;
};

export interface IEnrollmentReport {
    courseId: string;
    courseName: string;
    enrollmentsOverTime: TEnrollmentOverTime[];
}

export interface ITopStudentReport {
    courseId: string;
    courseName: string;
    topStudents: IStudent[];
} 