import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
  DEMO_GROUPS_ROWS,
  DEMO_FACILITIES_ROWS,
  DEMO_ATHLETES_ROWS,
  DEMO_ORG_USERS_ROWS,
} from "@/lib/demoFallbacks";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import {
  Plus,
  Building2,
  Users,
  Stethoscope,
  Wrench,
  UserSquare2,
  MapPin,
  Trash2,
  FolderTree,
} from "lucide-react";

export const Route = createFileRoute("/_app/club")({
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <ClubPage />
      </AppLayout>
    </RoleGate>
  ),
});

function ClubPage() {
  const t = useT();
  const { profile } = useAuth();
  const lang = (profile?.language ?? "es") as "es" | "en";
  const orgId = profile?.organization_id ?? null;
  const qc = useQueryClient();

  const sectionsQ = useQuery({
    queryKey: ["sport_sections", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("sport_sections").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const categoriesQ = useQuery({
    queryKey: ["categories", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,section_id")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const groupsQ = useQuery({
    queryKey: ["groups", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id,name,section_id,category_id")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const facilitiesQ = useQuery({
    queryKey: ["facilities", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("facilities").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const athletesCountQ = useQuery({
    queryKey: ["athletes_count", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("athletes")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const usersQ = useQuery({
    queryKey: ["org_users", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data: profiles, error: e1 } = await supabase
        .from("profiles")
        .select("id,full_name,email")
        .eq("organization_id", orgId!);
      if (e1) throw e1;
      const { data: rolesRows, error: e2 } = await supabase
        .from("user_roles")
        .select("user_id,role")
        .eq("organization_id", orgId!);
      if (e2) throw e2;
      const byUser = new Map<string, string[]>();
      (rolesRows ?? []).forEach((r) => {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role as string);
        byUser.set(r.user_id, arr);
      });
      return (profiles ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] }));
    },
  });

  const orgUsers = usersQ.data ?? DEMO_ORG_USERS_ROWS;
  const counts = {
    managers: orgUsers.filter((u) => u.roles.includes("manager")).length,
    medical: orgUsers.filter((u) => u.roles.includes("medical")).length,
    technical: orgUsers.filter((u) => u.roles.includes("technical")).length,
    athletes: athletesCountQ.data ?? DEMO_ATHLETES_ROWS.length,
  };

  // Section CRUD
  const [secOpen, setSecOpen] = useState(false);
  const [newSec, setNewSec] = useState("");
  const addSection = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("sport_sections")
        .insert({ name, organization_id: orgId! });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "es" ? "Sección creada" : "Section created");
      qc.invalidateQueries({ queryKey: ["sport_sections"] });
      setNewSec("");
      setSecOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delSection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sport_sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sport_sections"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  // Category CRUD
  const [catOpen, setCatOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", section_id: "" });
  const addCategory = useMutation({
    mutationFn: async (v: { name: string; section_id: string }) => {
      const { error } = await supabase
        .from("categories")
        .insert({ name: v.name, section_id: v.section_id, organization_id: orgId! });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "es" ? "Categoría creada" : "Category created");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewCat({ name: "", section_id: "" });
      setCatOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  // Group CRUD
  const [grpOpen, setGrpOpen] = useState(false);
  const [newGrp, setNewGrp] = useState({ name: "", section_id: "", category_id: "" });
  const addGroup = useMutation({
    mutationFn: async (v: { name: string; section_id: string; category_id: string }) => {
      const { error } = await supabase.from("groups").insert({
        name: v.name,
        section_id: v.section_id,
        category_id: v.category_id,
        organization_id: orgId!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "es" ? "Grupo creado" : "Group created");
      qc.invalidateQueries({ queryKey: ["groups"] });
      setNewGrp({ name: "", section_id: "", category_id: "" });
      setGrpOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  // Facility CRUD
  const [facOpen, setFacOpen] = useState(false);
  const [newFac, setNewFac] = useState({ name: "", address: "", capacity: "" });
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  const addFacility = useMutation({
    mutationFn: async (v: { name: string; address: string; capacity: string }) => {
      const { error } = await supabase.from("facilities").insert({
        name: v.name,
        address: v.address || null,
        location: v.address || null,
        capacity: v.capacity ? Number(v.capacity) : null,
        organization_id: orgId!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "es" ? "Instalación creada" : "Facility created");
      qc.invalidateQueries({ queryKey: ["facilities"] });
      setNewFac({ name: "", address: "", capacity: "" });
      setFacOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delFacility = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("facilities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["facilities"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const sections = sectionsQ.data ?? DEMO_SECTIONS_ROWS;
  const categories = categoriesQ.data ?? DEMO_CATEGORIES_ROWS;
  const groups = groupsQ.data ?? DEMO_GROUPS_ROWS;
  const facilities = facilitiesQ.data ?? DEMO_FACILITIES_ROWS;

  return (
    <>
      <PageHeader
        title={t("club_organization")}
        subtitle={
          lang === "es"
            ? "Vista general del club, instalaciones, secciones, categorías y grupos."
            : "Overview of club, facilities and structure."
        }
      />

      {/* Users summary */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("users_permissions")}</h2>
          <p className="text-xs text-muted-foreground">
            {lang === "es"
              ? "Para invitar usuarios usa Configuración → Equipo (próximamente)."
              : "Invite users via Settings → Team (coming soon)."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <RoleCard icon={UserSquare2} label={t("managers")} value={counts.managers} />
          <RoleCard icon={Stethoscope} label={t("medical_staff")} value={counts.medical} />
          <RoleCard icon={Wrench} label={t("technical_staff")} value={counts.technical} />
          <RoleCard icon={Users} label={t("athletes")} value={counts.athletes} />
          <Link
            to="/athletes"
            className="flex items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-sm font-medium text-primary hover:bg-primary/10"
          >
            {t("view_all")} →
          </Link>
        </div>
      </Card>

      {/* Facilities */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("facilities")}</h2>
          <Dialog open={facOpen} onOpenChange={setFacOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                {lang === "es" ? "Nueva instalación" : "New facility"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang === "es" ? "Nueva instalación" : "New facility"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t("name")}</Label>
                  <Input
                    value={newFac.name}
                    onChange={(e) => setNewFac({ ...newFac, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === "es" ? "Dirección" : "Address"}</Label>
                  <Input
                    value={newFac.address}
                    onChange={(e) => setNewFac({ ...newFac, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === "es" ? "Aforo" : "Capacity"}</Label>
                  <Input
                    type="number"
                    value={newFac.capacity}
                    onChange={(e) => setNewFac({ ...newFac, capacity: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFacOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  disabled={!newFac.name || addFacility.isPending}
                  onClick={() => addFacility.mutate(newFac)}
                >
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {facilities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {lang === "es" ? "Aún no hay instalaciones." : "No facilities yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map(
              (f: {
                id: string;
                name: string;
                photo_url?: string | null;
                address?: string | null;
                capacity?: number | null;
                status?: string;
              }) => (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-primary hover:shadow-sm"
                >
                  <button
                    onClick={() => setActiveFacility(f.id)}
                    className="block w-full text-left"
                  >
                    {f.photo_url && (
                      <div className="relative h-28 w-full overflow-hidden bg-muted">
                        <img
                          src={f.photo_url}
                          alt={f.name}
                          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Building2 className="h-4 w-4 text-primary" />
                        {f.name}
                      </div>
                      {(f.address || f.location) && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {f.address ?? f.location}
                        </div>
                      )}
                      {f.capacity && (
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          {lang === "es" ? "Aforo" : "Capacity"}: {f.capacity}
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(t("delete_confirm"))) delFacility.mutate(f.id);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-card/80 p-1.5 text-destructive opacity-0 backdrop-blur transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </Card>

      <FacilityDrawer
        id={activeFacility}
        facilities={facilities}
        onClose={() => setActiveFacility(null)}
      />

      {/* Sections */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("sports_sections")}</h2>
            <p className="text-xs text-muted-foreground">{t("organization_chart")}</p>
          </div>
          <Dialog open={secOpen} onOpenChange={setSecOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full">
                <Plus className="mr-1 h-4 w-4" />
                {t("new_section")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("new_section")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label>{t("name")}</Label>
                <Input value={newSec} onChange={(e) => setNewSec(e.target.value)} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSecOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  disabled={!newSec.trim() || addSection.isPending}
                  onClick={() => addSection.mutate(newSec.trim())}
                >
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {sections.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {lang === "es"
              ? "Crea tu primera sección deportiva."
              : "Create your first sport section."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sections.map((s) => {
              const catCount = categories.filter((c) => c.section_id === s.id).length;
              const grpCount = groups.filter((g) => g.section_id === s.id).length;
              return (
                <div
                  key={s.id}
                  className="group relative rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
                >
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                    <span>
                      {catCount} {lang === "es" ? "categorías" : "categories"}
                    </span>
                    <span>
                      {grpCount} {lang === "es" ? "grupos" : "groups"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(t("delete_confirm"))) delSection.mutate(s.id);
                    }}
                    className="absolute right-2 top-2 rounded-full p-1.5 text-destructive opacity-0 transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Categories */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{lang === "es" ? "Categorías" : "Categories"}</h2>
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={sections.length === 0}
              >
                <Plus className="mr-1 h-4 w-4" />
                {lang === "es" ? "Nueva categoría" : "New category"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang === "es" ? "Nueva categoría" : "New category"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t("name")}</Label>
                  <Input
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === "es" ? "Sección" : "Section"}</Label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newCat.section_id}
                    onChange={(e) => setNewCat({ ...newCat, section_id: e.target.value })}
                  >
                    <option value="">—</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCatOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  disabled={!newCat.name || !newCat.section_id || addCategory.isPending}
                  onClick={() => addCategory.mutate(newCat)}
                >
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {lang === "es" ? "Sin categorías todavía." : "No categories yet."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((c) => {
              const sec = sections.find((s) => s.id === c.section_id);
              return (
                <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="font-medium">{c.name}</span>{" "}
                    <span className="text-xs text-muted-foreground">· {sec?.name ?? "—"}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(t("delete_confirm"))) delCategory.mutate(c.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Groups */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            {lang === "es" ? "Grupos" : "Groups"}
          </h2>
          <Dialog open={grpOpen} onOpenChange={setGrpOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={categories.length === 0}
              >
                <Plus className="mr-1 h-4 w-4" />
                {lang === "es" ? "Nuevo grupo" : "New group"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang === "es" ? "Nuevo grupo" : "New group"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>{t("name")}</Label>
                  <Input
                    value={newGrp.name}
                    onChange={(e) => setNewGrp({ ...newGrp, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === "es" ? "Sección" : "Section"}</Label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newGrp.section_id}
                    onChange={(e) =>
                      setNewGrp({ ...newGrp, section_id: e.target.value, category_id: "" })
                    }
                  >
                    <option value="">—</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{lang === "es" ? "Categoría" : "Category"}</Label>
                  <select
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newGrp.category_id}
                    onChange={(e) => setNewGrp({ ...newGrp, category_id: e.target.value })}
                  >
                    <option value="">—</option>
                    {categories
                      .filter((c) => c.section_id === newGrp.section_id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGrpOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  disabled={
                    !newGrp.name || !newGrp.section_id || !newGrp.category_id || addGroup.isPending
                  }
                  onClick={() => addGroup.mutate(newGrp)}
                >
                  {t("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {groups.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {lang === "es" ? "Sin grupos todavía." : "No groups yet."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {groups.map((g) => {
              const sec = sections.find((s) => s.id === g.section_id);
              const cat = categories.find((c) => c.id === g.category_id);
              return (
                <li key={g.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="font-medium">{g.name}</span>{" "}
                    <span className="text-xs text-muted-foreground">
                      · {sec?.name} / {cat?.name}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(t("delete_confirm"))) delGroup.mutate(g.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}

function RoleCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FacilityDrawer({
  id,
  facilities,
  onClose,
}: {
  id: string | null;
  facilities: Array<{
    id: string;
    name: string;
    photo_url?: string | null;
    address?: string | null;
    capacity?: number | null;
    status?: string;
  }>;
  onClose: () => void;
}) {
  const f = facilities.find((x) => x.id === id) ?? null;
  return (
    <Sheet open={!!f} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {f && (
          <>
            <SheetHeader>
              <SheetTitle>{f.name}</SheetTitle>
            </SheetHeader>
            {f.photo_url && (
              <img
                src={f.photo_url}
                alt={f.name}
                className="mt-4 h-44 w-full rounded-2xl object-cover"
              />
            )}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Dirección</dt>
                <dd className="text-right">{f.address ?? f.location ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Aforo</dt>
                <dd>{f.capacity ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estado</dt>
                <dd>{f.status}</dd>
              </div>
            </dl>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
