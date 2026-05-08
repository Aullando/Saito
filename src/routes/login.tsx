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

function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const setUser = useLocalAuth((s) => s.setUser);
  const [selected, setSelected] = useState<string>(ROLE_USERS[0]?.id ?? "");

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setUser(selected);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>
        <div className="saito-card p-8">
          <h1 className="mb-6 text-center text-2xl font-bold">Entrar</h1>

          <form onSubmit={submit} className="space-y-4">
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
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
