import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

const STORAGE_KEY = "saito.sih-banner.dismissed";

export function SportInnovationBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.hostname.includes("sportinnovationhub.com")) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  return (
    <div className="sticky top-0 z-[60] w-full bg-[#0067C9] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-2 text-sm">
        <span className="font-semibold uppercase tracking-wider">SAITO</span>
        <span className="opacity-90">¿Qué quieres ver?</span>
        <Link
          to="/"
          className="rounded-full bg-white/15 px-3 py-1 font-semibold hover:bg-white/25"
          onClick={dismiss}
        >
          Web comercial
        </Link>
        <Link
          to="/login"
          className="rounded-full bg-white px-3 py-1 font-semibold text-[#0067C9] hover:bg-white/90"
          onClick={dismiss}
        >
          Demo
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="ml-2 rounded-full p-1 hover:bg-white/15"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
