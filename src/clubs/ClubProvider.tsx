import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getClubConfig, isModuleEnabled, DEFAULT_CLUB_ID, CLUBS } from "./registry";
import { useActiveClubStore } from "./activeClub";
import type { ClubConfig, ClubModuleId } from "./types";

type ClubCtx = {
  club: ClubConfig;
  availableClubs: ClubConfig[];
  switchClub: (id: string | null) => void;
  isModuleEnabled: (mod: ClubModuleId) => boolean;
};

const Ctx = createContext<ClubCtx | undefined>(undefined);

/**
 * Resolves the active club from the authenticated user's organization slug.
 * - No session  → SAITO default
 * - Org slug matches a registered club → that club's config
 * - Org slug unknown → SAITO default (safe fallback)
 */
export function ClubProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const orgId = profile?.organization_id ?? null;

  const orgQ = useQuery({
    queryKey: ["club-org", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, slug")
        .eq("id", orgId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const slug = orgQ.data?.slug ?? null;
  const overrideClubId = useActiveClubStore((s) => s.overrideClubId);
  const switchClub = useActiveClubStore((s) => s.switchClub);

  const activeId = overrideClubId ?? slug ?? DEFAULT_CLUB_ID;
  const club = useMemo(() => getClubConfig(activeId), [activeId]);

  // Apply brand color overrides at runtime (non-destructive: only if defined).
  useEffect(() => {
    const root = document.documentElement;
    const prevPrimary = root.style.getPropertyValue("--primary");
    const prevAccent = root.style.getPropertyValue("--accent");
    if (club.brand.primary) root.style.setProperty("--primary", club.brand.primary);
    if (club.brand.accent) root.style.setProperty("--accent", club.brand.accent);
    return () => {
      if (club.brand.primary) {
        if (prevPrimary) root.style.setProperty("--primary", prevPrimary);
        else root.style.removeProperty("--primary");
      }
      if (club.brand.accent) {
        if (prevAccent) root.style.setProperty("--accent", prevAccent);
        else root.style.removeProperty("--accent");
      }
    };
  }, [club]);

  const value = useMemo<ClubCtx>(
    () => ({
      club,
      availableClubs: Object.values(CLUBS),
      switchClub,
      isModuleEnabled: (m) => isModuleEnabled(club, m),
    }),
    [club, switchClub],
  );


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClub() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useClub must be used inside <ClubProvider>");
  return v;
}
