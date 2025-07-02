"use client";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CourseEnrollmentChartProps {
  series: any[];
  options: any;
}

export default function CourseEnrollmentChart({ series, options }: CourseEnrollmentChartProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Course Enrollments</h2>
      <div className="flex-1">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
} 