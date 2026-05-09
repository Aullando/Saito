import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

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
    toast.success("Organization created");
    navigate({ to: "/club" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>
        <div className="saito-card p-8">
          <h1 className="text-center text-2xl font-bold">Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create your organization to get started.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="org">Organization name</Label>
              <Input
                id="org"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Sports Club"
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? "Creating..." : "Create organization"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
