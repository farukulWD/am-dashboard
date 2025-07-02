"use client"
import { toggleSidebar } from "@/store/features/sideBarSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";

const Backdrop: React.FC = () => {
const { isMobileOpen } = useAppSelector((state) => state.sidebar);
const dispatch = useAppDispatch();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={() => dispatch(toggleSidebar())}
    />
  );
};

export default Backdrop;
