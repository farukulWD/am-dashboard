"use client";

import { useAppSelector } from "@/store/hooks";
import { GridIcon, UserCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

function AppSideBar() {
  const { isMobileOpen, isExpanded } = useAppSelector((state) => state.sidebar);
  const pathname = usePathname();
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
    },

    {
      icon: <UserCircleIcon />,
      name: "Student",
      path: "/student",
    },
  ];

  const renderMenuItems = (nav: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {nav.map((item, index) => (
        <li key={index}>
          {item.path ? (
            <Link
              href={item.path}
              className={`menu-item group ${
                isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span
                className={`${
                  isActive(item.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {item.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className={`menu-item-text`}>{item.name}</span>
              )}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200   ${
        isExpanded ? "w-[290px]" : "w-[90px]"
      }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          <Image
            src="/images/logo/logo.svg"
            alt="Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(navItems)}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default AppSideBar;
