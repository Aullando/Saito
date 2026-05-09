import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth as useLocalAuth } from "@/lib/store";
import { DEMO_USERS } from "@/lib/seed";

type Role = "sysadmin" | "admin" | "manager" | "technical" | "medical";

type Profile = {
  id: string;
  organization_id: string | null;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
};

type SessionLike = { user: { id: string; email: string } } | null;

type AuthCtx = {
  session: SessionLike;
  user: { id: string; email: string } | null;
  profile: Profile | null;
  roles: Role[];
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const currentUserId = useLocalAuth((s) => s.currentUserId);
  const setUser = useLocalAuth((s) => s.setUser);

  const value = useMemo<AuthCtx>(() => {
    const demo = currentUserId ? (DEMO_USERS.find((u) => u.id === currentUserId) ?? null) : null;
    if (!demo) {
      return {
        session: null,
        user: null,
        profile: null,
        roles: [],
        loading: false,
        signOut: async () => setUser(null),
        refresh: async () => {},
      };
    }
    return {
      session: { user: { id: demo.id, email: demo.email } },
      user: { id: demo.id, email: demo.email },
      profile: {
        id: demo.id,
        organization_id: "org-3",
        email: demo.email,
        full_name: demo.name,
        avatar_url: null,
        language: demo.language,
      },
      roles: [demo.role as Role],
      loading: false,
      signOut: async () => setUser(null),
      refresh: async () => {},
    };
  }, [currentUserId, setUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
