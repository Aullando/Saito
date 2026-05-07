import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser, useAuth, useData, useUserAvatar } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { useNavigate } from "@tanstack/react-router";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/profile")({
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
  const u = useCurrentUser()!;
  const setUser = useAuth((s) => s.setUser);
  const setAvatar = useAuth((s) => s.setAvatar);
  const removeAvatar = useAuth((s) => s.removeAvatar);
  const avatar = useUserAvatar(u.id);
  const reset = useData((s) => s.reset);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 4 * 1024 * 1024) {
      alert(u.language === "es" ? "Imagen demasiado grande (máx 4MB)" : "Image too large (max 4MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(u.id, String(reader.result));
    reader.readAsDataURL(f);
  };

  return (
    <>
      <PageHeader title={t("profile_settings")} />

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt={u.name} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{u.initials}</div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground shadow hover:bg-muted"
                aria-label={u.language === "es" ? "Cambiar foto" : "Change photo"}
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
                onClick={() => removeAvatar(u.id)}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive"
              >
                {u.language === "es" ? "Quitar foto" : "Remove photo"}
              </button>
            )}
            <div className="mt-4 text-lg font-semibold">{u.name}</div>
            <div className="text-sm text-muted-foreground">{u.email}</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-primary">{u.role}</div>
            {u.specialty && <div className="mt-3 text-xs text-muted-foreground">{u.specialty} · {u.area}</div>}
            {u.licenseNumber && <div className="text-xs text-muted-foreground">Nº col. {u.licenseNumber}</div>}
            <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setUser(null); navigate({ to: "/login" }); }}>{t("logout")}</Button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">{t("settings")}</h2>
          <div className="space-y-4 text-sm">
            <SettingRow label={t("notifications")} control={<Switch defaultChecked />} />
            <SettingRow label={t("language")} control={<span className="text-muted-foreground">{u.language === "es" ? "Español" : "English"}</span>} />
            <SettingRow label={t("change_password")} control={<Button size="sm" variant="outline" className="rounded-full">{t("change_password")}</Button>} />
            <SettingRow label={u.language === "es" ? "Datos de demo" : "Demo data"} control={<Button size="sm" variant="outline" className="rounded-full" onClick={() => { if (confirm(u.language === "es" ? "¿Reiniciar datos de demo?" : "Reset demo data?")) reset(); }}>{u.language === "es" ? "Reset" : "Reset"}</Button>} />
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
