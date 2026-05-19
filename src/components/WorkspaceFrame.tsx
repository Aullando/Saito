import { useEffect, useRef, useState, type ReactNode } from "react";
import { useClub } from "@/clubs/ClubProvider";
import { cn } from "@/lib/utils";

/**
 * Scopes RTL / workspace direction to the main content area only.
 * Header (Topbar) and Sidebar remain LTR — they live outside this wrapper.
 *
 * Also plays a brief fade+scale transition when the active club changes,
 * respecting `prefers-reduced-motion`.
 */
export function WorkspaceFrame({ children }: { children: ReactNode }) {
  const { club } = useClub();
  const direction = club.workspace?.direction ?? "ltr";
  const locale = club.workspace?.locale;
  const lang = locale ?? (club.brand.defaultLanguage as string);

  const [phase, setPhase] = useState<"in" | "out">("in");
  const prevClubId = useRef(club.id);

  useEffect(() => {
    if (prevClubId.current === club.id) return;
    prevClubId.current = club.id;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("in");
      return;
    }

    setPhase("out");
    const t = window.setTimeout(() => setPhase("in"), 200);
    return () => window.clearTimeout(t);
  }, [club.id]);

  const extraClass = club.workspace?.className;

  return (
    <div
      key={club.id}
      dir={direction}
      lang={lang}
      data-workspace={club.id}
      data-direction={direction}
      className={cn(
        "workspace-frame",
        direction === "rtl" && "workspace-rtl",
        club.id === "gff-demo" && "workspace-gff",
        extraClass,
        "transition-[opacity,transform] ease-out",
        phase === "out"
          ? "opacity-0 scale-[0.98] duration-200"
          : "opacity-100 scale-100 duration-[250ms] motion-safe:animate-fade-in",
      )}
    >
      {children}
    </div>
  );
}

export default WorkspaceFrame;
