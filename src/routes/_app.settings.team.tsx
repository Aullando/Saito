import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useT, useTr } from "@/lib/i18n";
import { isDemoMode } from "@/lib/appMode";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Plus, Trash2, Mail } from "lucide-react";

export const Route = createFileRoute("/_app/settings/team")({
  component: () => (
    <RoleGate roles={["admin"]}>
      <AppLayout>
        <TeamPage />
      </AppLayout>
    </RoleGate>
  ),
});

const ALL_ROLES = ["admin", "manager", "technical", "medical"] as const;
type RoleName = (typeof ALL_ROLES)[number];

function TeamPage() {
  const t = useT();
  const tr = useTr();
  const qc = useQueryClient();
  const { profile, user: me } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const demo = isDemoMode();
  const prodOnly = tr("Disponible en producción", "Available in production", "Dostupno u produkciji");

  const membersQ = useQuery({
    queryKey: ["team", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data: profs, error: e1 } = await supabase
        .from("profiles")
        .select("id,full_name,email,avatar_url")
        .eq("organization_id", orgId!);
      if (e1) throw e1;
      const { data: rs, error: e2 } = await supabase
        .from("user_roles")
        .select("user_id,role")
        .eq("organization_id", orgId!);
      if (e2) throw e2;
      const byUser = new Map<string, RoleName[]>();
      (rs ?? []).forEach((r) => {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role as RoleName);
        byUser.set(r.user_id, arr);
      });
      return (profs ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, on }: { userId: string; role: RoleName; on: boolean }) => {
      if (on) {
        const { error } = await supabase.from("user_roles").insert({
          user_id: userId,
          organization_id: orgId!,
          role,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("organization_id", orgId!)
          .eq("role", role);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("organization_id", orgId!);
      const { error } = await supabase
        .from("profiles")
        .update({ organization_id: null })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Miembro eliminado", "Member removed", "Član uklonjen"));
      qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ email: string; full_name: string; roles: RoleName[] }>({
    email: "",
    full_name: "",
    roles: ["manager"],
  });
  const invite = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("invite-team-member", {
        body: { email: form.email, full_name: form.full_name, roles: form.roles },
      });
      if (error) throw error;
      const d = data as { error?: string; invited?: boolean } | null;
      if (d?.error) throw new Error(d.error);
      return data;
    },
    onSuccess: (data: { invited?: boolean } | null) => {
      toast.success(
        data?.invited
          ? tr("Invitación enviada", "Invitation sent", "Poziv poslat")
          : tr("Usuario añadido", "User added", "Korisnik dodat"),
      );
      qc.invalidateQueries({ queryKey: ["team"] });
      setForm({ email: "", full_name: "", roles: ["manager"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const { DEMO_USERS } = demo ? require("@/lib/seed") as typeof import("@/lib/seed") : { DEMO_USERS: [] as never[] };
  const members = demo
    ? (DEMO_USERS as { id: string; email: string; name: string; role: RoleName }[]).map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.name,
        avatar_url: null as string | null,
        roles: [u.role] as RoleName[],
      }))
    : membersQ.data ?? [];

  return (
    <>
      <PageHeader
        title={tr("Equipo y permisos", "Team & permissions", "Tim i dozvole")}
        subtitle={tr(
          "Gestiona los miembros de tu organización y sus roles.",
          "Manage members of your organization and their roles.",
          "Upravljajte članovima organizacije i njihovim ulogama.",
        )}
        actions={
          demo ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button className="rounded-full opacity-60" disabled>
                      <Plus className="mr-1 h-4 w-4" />
                      {tr("Invitar", "Invite", "Pozovi")}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{prodOnly}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                {tr("Invitar", "Invite", "Pozovi")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tr("Invitar miembro", "Invite member", "Pozovi člana")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{tr("Nombre", "Full name", "Ime i prezime")}</Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{tr("Roles", "Roles", "Uloge")}</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_ROLES.map((r) => {
                      const on = form.roles.includes(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              roles: on ? form.roles.filter((x) => x !== r) : [...form.roles, r],
                            })
                          }
                          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  disabled={!form.email || form.roles.length === 0 || invite.isPending}
                  onClick={() => invite.mutate()}
                >
                  <Mail className="mr-1 h-4 w-4" />
                  {tr("Enviar invitación", "Send invite", "Pošalji poziv")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )
        }
      />

      {demo && (
        <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          {tr(
            "Modo demo: la gestión de invitaciones, roles y bajas requiere el backend real. Se muestra la lista de miembros de la organización SAITO como referencia.",
            "Demo mode: managing invitations, roles and removals requires the real backend. The SAITO organization member list is shown for reference.",
            "Demo režim: upravljanje pozivima, ulogama i uklanjanjem zahteva pravi backend. Prikazana je lista članova SAITO organizacije kao referenca.",
          )}
        </div>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">{tr("Miembro", "Member", "Član")}</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">{tr("Roles", "Roles", "Uloge")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {membersQ.isLoading && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">
                    …
                  </td>
                </tr>
              )}
              {!membersQ.isLoading && members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">
                    {tr("Sin miembros.", "No members.", "Nema članova.")}
                  </td>
                </tr>
              )}
              {members.map((m) => {
                const isMe = m.id === me?.id;
                return (
                  <tr key={m.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {m.avatar_url ? (
                          <img
                            src={m.avatar_url}
                            className="h-7 w-7 rounded-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {(m.full_name || m.email || "?").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>
                          {m.full_name ?? "—"}
                          {isMe && (
                            <span className="ml-2 text-[10px] uppercase text-primary">
                              {tr("Tú", "You", "Ti")}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_ROLES.map((r) => {
                          const on = m.roles.includes(r);
                          const disabled = isMe && r === "admin" && on;
                          return (
                            <button
                              key={r}
                              disabled={disabled || toggleRole.isPending}
                              onClick={() => toggleRole.mutate({ userId: m.id, role: r, on: !on })}
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider transition ${
                                on
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground hover:border-primary"
                              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                              title={
                                disabled
                                  ? tr("No puedes quitarte admin", "You can't remove your own admin", "Ne možete sebi ukloniti admin ulogu")
                                  : ""
                              }
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {!isMe && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => {
                            if (
                              confirm(
                                tr(
                                  "¿Eliminar miembro de la organización?",
                                  "Remove member from organization?",
                                  "Ukloniti člana iz organizacije?",
                                ),
                              )
                            )
                              removeMember.mutate(m.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
