"use client";

import { motion } from "framer-motion";
import StudentsList from "@/components/students/StudentsList";






export default function StudentsPage() {
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
      <StudentsList />
    </div>
  );
}
