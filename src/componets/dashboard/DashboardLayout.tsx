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

  const isDark = typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDark(!dark);
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    setSidebarOpen(!mq.matches);
    document.documentElement.classList.toggle("dark");

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="flex h-full">
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed z-30 top-0 left-0 w-64 h-screen p-6 shadow-lg md:hidden${isDark ? '' : ' border-r'}`}
              style={{
                background: 'var(--color-sidebar)',
                color: 'var(--color-sidebar-foreground)',
                ...(isDark ? {} : { borderColor: 'var(--color-border)' })
              }}
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {!isMobile && (
          <aside
            className={`hidden md:flex flex-col w-64 h-full p-6 shadow-lg fixed left-0 top-0${isDark ? '' : ' border-r'}`}
            style={{
              background: 'var(--color-sidebar)',
              color: 'var(--color-sidebar-foreground)',
              ...(isDark ? {} : { borderColor: 'var(--color-border)' })
            }}
          >
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
          <header
            className={`flex items-center justify-between px-6 py-4 sticky top-0 z-10${isDark ? '' : ' border-b'}`}
            style={{
              background: 'var(--color-navbar)',
              color: 'var(--color-navbar-foreground)',
              ...(isDark ? {} : { borderColor: 'var(--color-border)' })
            }}
          >
            <button
              className="text-2xl focus:outline-none md:hidden"
              style={{ color: 'var(--color-navbar-foreground)' }}
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div className="flex-1 flex justify-center md:justify-end">
              <button
                className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-colors"
                style={{
                  background: 'var(--color-navbar)',
                  color: 'var(--color-navbar-foreground)',
                  borderColor: 'var(--color-border)'
                }}
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
        <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>AM</span>
        <span className="text-lg font-semibold" style={{ color: 'var(--color-sidebar-foreground)' }}>Dashboard</span>
      </div>
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-sidebar-foreground)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--color-hover)';
              e.currentTarget.style.color = 'var(--color-hover-foreground)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-sidebar-foreground)';
            }}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
