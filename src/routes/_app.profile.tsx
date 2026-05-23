import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth as useUiAuth, useUserAvatar } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useT, useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: () => (
    <RoleGate roles={["sysadmin", "admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <ProfilePage />
      </AppLayout>
    </RoleGate>
  ),
});

function ProfilePage() {
  const t = useT();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, profile, roles, signOut, refresh } = useAuth();
  const setAvatar = useUiAuth((s) => s.setAvatar);
  const removeAvatar = useUiAuth((s) => s.removeAvatar);
  const avatar = useUserAvatar(user?.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const lang = useLang();

  const orgQ = useQuery({
    queryKey: ["organization", profile?.organization_id],
    enabled: !!profile?.organization_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", profile!.organization_id!)
        .maybeSingle();
      return data;
    },
  });

  const setLang = useMutation({
    mutationFn: async (newLang: "es" | "en") => {
      const { error } = await supabase
        .from("profiles")
        .update({ language: newLang })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await refresh();
      qc.invalidateQueries();
    },
  });

  const setName = useMutation({
    mutationFn: async (full_name: string) => {
      const { error } = await supabase.from("profiles").update({ full_name }).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await refresh();
    },
  });

  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile?.full_name ?? "");

  const onPick = (f: File | undefined) => {
    if (!f || !user) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 4 * 1024 * 1024) {
      alert(lang === "es" ? "Imagen demasiado grande (máx 4MB)" : "Image too large (max 4MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(user.id, String(reader.result));
    reader.readAsDataURL(f);
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (!user) return null;

  const name = profile?.full_name || user.email?.split("@")[0] || "User";
  const parts = name.split(" ");
  const initials = ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
  const role = roles[0] ?? "—";

  return (
    <>
      <PageHeader title={t("profile_settings")} />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {avatar || profile?.avatar_url ? (
                <img
                  src={avatar || profile?.avatar_url || ""}
                  alt={name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground shadow hover:bg-muted"
                aria-label={lang === "es" ? "Cambiar foto" : "Change photo"}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
              />
            </div>
            {avatar && (
              <button
                type="button"
                onClick={() => removeAvatar(user.id)}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive"
              >
                {lang === "es" ? "Quitar foto" : "Remove photo"}
              </button>
            )}
            <div className="mt-4 text-lg font-semibold">{name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs uppercase tracking-wider text-primary"
                >
                  {r}
                </span>
              ))}
              {roles.length === 0 && (
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {role}
                </span>
              )}
            </div>
            {orgQ.data && (
              <div className="mt-3 text-xs text-muted-foreground">{orgQ.data.name}</div>
            )}
            <Button variant="outline" className="mt-6 rounded-full" onClick={handleLogout}>
              {t("logout")}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">{t("settings")}</h2>
          <div className="space-y-4 text-sm">
            <SettingRow
              label={lang === "es" ? "Nombre" : "Name"}
              control={
                editingName ? (
                  <div className="flex gap-2">
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setName.mutate(draftName);
                        setEditingName(false);
                      }}
                    >
                      OK
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>
                      X
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setDraftName(profile?.full_name ?? "");
                      setEditingName(true);
                    }}
                  >
                    {lang === "es" ? "Editar" : "Edit"}
                  </Button>
                )
              }
            />
            <SettingRow label={t("notifications")} control={<Switch defaultChecked />} />
            <SettingRow
              label={t("language")}
              control={
                <select
                  value={lang}
                  onChange={(e) => setLang.mutate(e.target.value as "es" | "en")}
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              }
            />
            <SettingRow
              label={t("change_password")}
              control={
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={async () => {
                    if (!user.email) return;
                    await supabase.auth.resetPasswordForEmail(user.email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    alert(lang === "es" ? "Email enviado" : "Email sent");
                  }}
                >
                  {t("change_password")}
                </Button>
              }
            />
          </div>
        </Card>
      </div>
    </>
  );
}

function SettingRow({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
      <span>{label}</span>
      <div>{control}</div>
    </div>
  );
}
