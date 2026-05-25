import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_app/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — SAITO" }] }),
  component: OnboardingPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function OnboardingPage() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const lang = useLang();
  const L =
    lang === "en"
      ? {
          welcome: "Welcome",
          subtitle: "Create your organization to get started.",
          orgLabel: "Organization name",
          placeholder: "My Sports Club",
          creating: "Creating…",
          create: "Create organization",
          successMsg: "Organization created",
        }
      : {
          welcome: "Bienvenido",
          subtitle: "Crea tu organización para comenzar.",
          orgLabel: "Nombre de la organización",
          placeholder: "Mi Club Deportivo",
          creating: "Creando…",
          create: "Crear organización",
          successMsg: "Organización creada",
        };
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.rpc("create_organization", {
      _name: name.trim(),
      _slug: slug,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    await refresh();
    toast.success(L.successMsg);
    navigate({ to: "/club" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>
        <div className="saito-card p-8">
          <h1 className="text-center text-2xl font-bold">
            {L.welcome}{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{L.subtitle}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="org">{L.orgLabel}</Label>
              <Input
                id="org"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={L.placeholder}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? L.creating : L.create}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
