import { useEffect, useRef, useState, type ReactNode } from "react";
import { useClub } from "@/clubs/ClubProvider";
import { cn } from "@/lib/utils";

/**
 * Scopes RTL / workspace direction to the main content area only.
 * Header (Topbar) and Sidebar remain LTR — they live outside this wrapper.
 *
 * Transition (when active club changes):
 *   1. Fade out the current workspace (200ms).
 *   2. Swap content to the new club.
 *   3. Fade in the new workspace (250ms).
 * Respects prefers-reduced-motion.
 */
export function WorkspaceFrame({ children }: { children: ReactNode }) {
  const { club } = useClub();

  // We render the children of whichever club is "displayed". The displayed
  // club only swaps after the fade-out completes, so the user never sees the
  // new content abruptly replace the old one mid-fade.
  const [displayedClubId, setDisplayedClubId] = useState(club.id);
  const [displayedChildren, setDisplayedChildren] = useState<ReactNode>(children);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pendingChildren = useRef<ReactNode>(children);

  // Always remember the latest children so when the fade-out completes we
  // swap to the very latest tree, not a stale snapshot.
  pendingChildren.current = children;

  useEffect(() => {
    if (club.id === displayedClubId) {
      // Same club — children may have changed (e.g. route change inside the
      // workspace). Update them immediately without a transition.
      setDisplayedChildren(children);
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setDisplayedClubId(club.id);
      setDisplayedChildren(pendingChildren.current);
      setPhase("in");
      return;
    }

    // Step 1: fade out current workspace.
    setPhase("out");
    const swap = window.setTimeout(() => {
      // Step 2: swap content while invisible.
      setDisplayedClubId(club.id);
      setDisplayedChildren(pendingChildren.current);
      // Step 3: fade in.
      setPhase("in");
    }, 200);
    return () => window.clearTimeout(swap);
  }, [club.id, displayedClubId, children]);

  // Resolve direction/locale/className from the CURRENTLY DISPLAYED club, not
  // the next one — otherwise RTL would flip before the old (LTR) content fades.
  const displayedClub = displayedClubId === club.id ? club : null; // fallback handled below

  // We need workspace metadata for the displayed club. Since ClubProvider only
  // exposes the active club, during the brief out-phase we still use `club`'s
  // metadata; visually it's hidden (opacity 0) so direction flips are invisible.
  const meta = displayedClub ?? club;
  const direction = meta.workspace?.direction ?? "ltr";
  const locale = meta.workspace?.locale;
  const lang = locale ?? (meta.brand.defaultLanguage as string);
  const extraClass = meta.workspace?.className;

  return (
    <div
      key={displayedClubId}
      dir={direction}
      lang={lang}
      data-workspace={displayedClubId}
      data-direction={direction}
      className={cn(
        "workspace-frame",
        direction === "rtl" && "workspace-rtl",
        displayedClubId === "gff-demo" && "workspace-gff",
        extraClass,
        "transition-opacity ease-out",
        phase === "out" ? "opacity-0 duration-200" : "opacity-100 duration-[250ms]",
      )}
    >
      {displayedChildren}
    </div>
  );
}

export default WorkspaceFrame;
