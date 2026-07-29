import { useEffect } from "react";

// Dark mode disabled for the demo. Kept as a no-op stub so any lingering imports don't break.
export function useTheme() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      try { localStorage.removeItem("saito-theme"); } catch {}
    }
  }, []);
  return { theme: "light" as const, toggle: () => {} };
}
