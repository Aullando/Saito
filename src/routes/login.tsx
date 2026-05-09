import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { DEMO_USERS } from "@/lib/seed";
import { useActiveClubStore } from "@/clubs/activeClub";
import { Building2, Trophy } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SAITO" }] }),
  component: LoginPage,
});

const ROLE_LABEL: Record<string, string> = {
  sysadmin: "SysAdmin",
  admin: "Admin",
  manager: "Manager",
  technical: "Technical",
  medical: "Medical",
};

const ROLE_USERS = DEMO_USERS.filter((u) => ROLE_LABEL[u.role]);

type ClubChoice = "saito" | "rgcc";

const CLUB_OPTIONS: { id: ClubChoice; name: string; subtitle: string; icon: typeof Building2 }[] = [
  {
    id: "saito",
    name: "SAITO",
    subtitle: "Demo genérica de la plataforma",
    icon: Building2,
  },
  {
    id: "rgcc",
    name: "Grupo Covadonga",
    subtitle: "Club ejemplo · Real Grupo de Cultura Covadonga",
    icon: Trophy,
  },
];

function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const setUser = useLocalAuth((s) => s.setUser);
  const switchClub = useActiveClubStore((s) => s.switchClub);

  const [club, setClub] = useState<ClubChoice>("saito");
  const [selected, setSelected] = useState<string>(ROLE_USERS[0]?.id ?? "");

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setUser(selected);
    switchClub(club);
    if (club === "rgcc") {
      navigate({ to: "/rgcc/mi-dia" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>
        <div className="saito-card p-8">
          <h1 className="mb-2 text-center text-2xl font-bold">Entrar al panel</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Elige un club de ejemplo y un rol para explorar la demo.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label>Club de ejemplo</Label>
              <div className="grid gap-2">
                {CLUB_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = club === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setClub(opt.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{opt.name}</div>
                        <div className="text-xs text-muted-foreground">{opt.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Selecciona un rol</Label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Elige un rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_USERS.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {ROLE_LABEL[u.role]} — {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full rounded-full">
              Entrar como {club === "rgcc" ? "Grupo Covadonga" : "SAITO"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
