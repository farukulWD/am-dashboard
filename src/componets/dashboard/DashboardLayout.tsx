"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Students", icon: "🎓" },
  { label: "Courses", icon: "📚" },
  { label: "Faculty", icon: "👩‍🏫" },
  { label: "Reports", icon: "📊" },
  { label: "Analytics", icon: "📈" },
  { label: "Attendance", icon: "📝" },
  { label: "Library", icon: "📖" },
  { label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDark(!dark);
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    setSidebarOpen(!mq.matches);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
      <div className="flex h-full">
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-30 top-0 left-0 w-64 h-screen bg-gray-900 p-6 shadow-lg border-r border-gray-800 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {!isMobile && (
          <aside className="hidden md:flex flex-col w-64 h-full bg-gray-900 p-6 shadow-lg border-r border-gray-800 fixed left-0 top-0">
            <SidebarContent />
          </aside>
        )}

        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col md:ml-64 h-full">
          <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
            <button
              className="text-gray-200 hover:text-blue-400 text-2xl focus:outline-none md:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div className="flex-1 flex justify-center md:justify-end">
              <button
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {dark ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl font-bold text-blue-500">AM</span>
        <span className="text-lg font-semibold text-gray-100">Dashboard</span>
      </div>
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-200 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
