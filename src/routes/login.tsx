import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useCurrentUser } from "@/lib/store";
import { DEMO_USERS } from "@/lib/seed";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In — SAITO" }] }),
  component: LoginPage,
});

function LoginPage() {
  const setUser = useAuth((s) => s.setUser);
  const current = useCurrentUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (current) navigate({ to: "/" });
  }, [current, navigate]);

  const lang: "en" | "es" = "en";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = DEMO_USERS.find((u) => u.email === email) ?? DEMO_USERS[1];
    setUser(u.id);
    navigate({ to: "/" });
  };

  const pickDemo = (id: string) => {
    setUser(id);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>
        <div className="saito-card p-8">
          <h1 className="text-center text-2xl font-bold">{t("log_in", lang)}</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email", lang)}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@club.demo" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("password", lang)}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="button" className="text-xs text-primary hover:underline">
              {t("forgot_password", lang)}
            </button>
            <Button type="submit" className="w-full rounded-full">
              {t("continue", lang)}
            </Button>
          </form>

          <div className="mt-8">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("demo_users", lang)}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => pickDemo(u.id)}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-left transition hover:border-primary hover:bg-accent"
                >
                  <div>
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{u.role}{u.language === "es" ? " · ES" : " · EN"}</div>
                  </div>
                  <span className="text-xs font-medium text-primary">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          {t("funded_eu", lang)}
        </p>
      </div>
    </div>
  );
}
