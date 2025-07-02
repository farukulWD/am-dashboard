"use client";
import { motion } from 'framer-motion';

interface Student {
  name: string;
  gpa: number;
}

interface TopStudentsTableProps {
  students: Student[];
}

export default function TopStudentsTable({ students }: TopStudentsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Rank</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">GPA</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <motion.tr
                key={student.name}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-2 font-semibold text-blue-600">{idx + 1}</td>
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.gpa.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 