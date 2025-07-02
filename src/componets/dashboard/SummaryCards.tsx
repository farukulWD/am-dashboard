"use client";
import { motion } from 'framer-motion';

interface SummaryItem {
  label: string;
  value: number;
}

interface SummaryCardsProps {
  summary: SummaryItem[];
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
      {summary.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border border-blue-100"
        >
          <span className="text-lg text-gray-500 mb-2">{item.label}</span>
          <span className="text-3xl font-extrabold text-blue-600">{item.value}</span>
        </motion.div>
      ))}
    </section>
  );
} 