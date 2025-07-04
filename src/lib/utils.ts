import { useEffect, useState } from "react";
import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
