import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { CopilotoCard, DEFAULT_ADMIN_SUGGESTIONS } from "@/components/CopilotoCard";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/lib/store";
import { useTr } from "@/lib/i18n";
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
  ShieldCheck,
  Baby,
  Clock,
  UserCog,
  Layers,
} from "lucide-react";
import type { Role } from "@/lib/types";
import {
  DAY_NAMES_ES,
  DAY_NAMES_EN,
  categoryName,
  Section,
  RoleCard,
  Stat,
} from "@/features/club/helpers";

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
  const tr = useTr();
  const sections = useData((s) => s.sections);
  const categories = useData((s) => s.categories);
  const groups = useData((s) => s.groups);
  const facilities = useData((s) => s.facilities);
  const athletes = useData((s) => s.athletes);
  const users = useData((s) => s.users);
  const events = useData((s) => s.events);

  const addSection = useData((s) => s.addSection);
  const deleteSection = useData((s) => s.deleteSection);
  const addCategory = useData((s) => s.addCategory);
  const deleteCategory = useData((s) => s.deleteCategory);
  const addGroup = useData((s) => s.addGroup);
  const deleteGroup = useData((s) => s.deleteGroup);
  const addFacility = useData((s) => s.addFacility);
  const deleteFacility = useData((s) => s.deleteFacility);

  // ───── Usuarios por rol ─────
  const usersByRole = useMemo(() => {
    const count = (r: Role) => users.filter((u) => u.role === r).length;
    return {
      managers: count("manager"),
      admins: count("admin"),
      medical: count("medical"),
      technical: count("technical"),
      athletes: athletes.length,
      tutors: athletes.filter((a) =>
        /Benjam|Alev|Infantil/i.test(categoryName(categories, a.categoryId)),
      ).length,
    };
  }, [users, athletes, categories]);

  // ───── Horario semanal por grupo (derivado de events training) ─────
  const groupSchedules = useMemo(() => {
    const DAY_NAMES = tr("es", "en") === "es" ? DAY_NAMES_ES : DAY_NAMES_EN;
    const map = new Map<string, Set<string>>();
    for (const e of events) {
      if (e.type !== "training" || !e.groupId) continue;
      const dow = new Date(e.date).getDay();
      const slot = `${DAY_NAMES[dow]} ${e.startTime}`;
      if (!map.has(e.groupId)) map.set(e.groupId, new Set());
      map.get(e.groupId)!.add(slot);
    }
    const out = new Map<string, string[]>();
    map.forEach((set, gid) => {
      out.set(
        gid,
        Array.from(set).sort((a, b) => {
          const da = DAY_NAMES.indexOf(a.slice(0, 3));
          const db = DAY_NAMES.indexOf(b.slice(0, 3));
          return da === db ? a.localeCompare(b) : da - db;
        }),
      );
    });
    return out;
  }, [events, tr]);


  // ───── Staff por grupo (heurística: técnicos repartidos por sección) ─────
  const staffByGroup = useMemo(() => {
    const techs = users.filter((u) => u.role === "technical");
    const m = new Map<string, string[]>();
    groups.forEach((g, idx) => {
      const assigned = techs[idx % Math.max(techs.length, 1)];
      m.set(g.id, assigned ? [assigned.name] : []);
    });
    return m;
  }, [groups, users]);

  // ───── Counts por sección ─────
  const sectionStats = useMemo(() => {
    return sections.map((s) => ({
      ...s,
      groups: groups.filter((g) => g.sectionId === s.id).length,
      athletes: athletes.filter((a) => a.sectionId === s.id).length,
      staff: (s.staffCount ?? 0) + (s.managerCount ?? 0),
    }));
  }, [sections, groups, athletes]);

  // ───── Form state ─────
  const [newSection, setNewSection] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatSection, setNewCatSection] = useState("");
  const [newGroup, setNewGroup] = useState({ name: "", sectionId: "", categoryId: "" });
  const [newFacility, setNewFacility] = useState({
    name: "",
    location: "",
    capacity: "",
    sectionId: "",
  });

  return (
    <>
      <PageHeader
        title={tr("Club & Organización", "Club & Organization")}
        subtitle={tr(
          "Núcleo administrativo del club: usuarios, instalaciones, secciones, categorías y grupos.",
          "Club administrative core: users, facilities, sections, categories and groups.",
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <a href="/athletes">
                <Plus className="mr-2 h-4 w-4" />
                {tr("Nueva alta", "New athlete")}
              </a>
            </Button>

            {/* Añadir sección */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {tr("Añadir sección", "Add section")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tr("Nueva sección deportiva", "New sports section")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>{tr("Nombre", "Name")}</Label>
                  <Input
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder={tr("Ej: Voleibol", "e.g. Volleyball")}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!newSection.trim()) return;
                      addSection(newSection.trim());
                      setNewSection("");
                      toast.success(tr("Sección añadida", "Section added"));
                    }}
                  >
                    {tr("Crear", "Create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Añadir categoría */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {tr("Añadir categoría", "Add category")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tr("Nueva categoría", "New category")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{tr("Sección", "Section")}</Label>
                    <Select value={newCatSection} onValueChange={setNewCatSection}>
                      <SelectTrigger>
                        <SelectValue placeholder={tr("Selecciona sección", "Select section")} />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Nombre", "Name")}</Label>
                    <Input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder={tr("Ej: Cadete", "e.g. Cadet")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!newCatName.trim() || !newCatSection) return;
                      addCategory({ name: newCatName.trim(), sectionId: newCatSection });
                      setNewCatName("");
                      setNewCatSection("");
                      toast.success(tr("Categoría añadida", "Category added"));
                    }}
                  >
                    {tr("Crear", "Create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Añadir grupo */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {tr("Añadir grupo", "Add group")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tr("Nuevo grupo", "New group")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{tr("Sección", "Section")}</Label>
                    <Select
                      value={newGroup.sectionId}
                      onValueChange={(v) =>
                        setNewGroup({ ...newGroup, sectionId: v, categoryId: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={tr("Selecciona sección", "Select section")} />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Categoría", "Category")}</Label>
                    <Select
                      value={newGroup.categoryId}
                      onValueChange={(v) => setNewGroup({ ...newGroup, categoryId: v })}
                      disabled={!newGroup.sectionId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={tr("Selecciona categoría", "Select category")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.sectionId === newGroup.sectionId)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Nombre", "Name")}</Label>
                    <Input
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      placeholder={tr("Ej: Tecnificación", "e.g. Elite squad")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!newGroup.name.trim() || !newGroup.sectionId || !newGroup.categoryId)
                        return;
                      addGroup({
                        name: newGroup.name.trim(),
                        sectionId: newGroup.sectionId,
                        categoryId: newGroup.categoryId,
                      });
                      setNewGroup({ name: "", sectionId: "", categoryId: "" });
                      toast.success(tr("Grupo añadido", "Group added"));
                    }}
                  >
                    {tr("Crear", "Create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Añadir instalación */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {tr("Añadir instalación", "Add facility")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tr("Nueva instalación", "New facility")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>{tr("Nombre", "Name")}</Label>
                    <Input
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                      placeholder={tr("Ej: Sala de musculación", "e.g. Strength room")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Ubicación", "Location")}</Label>
                    <Input
                      value={newFacility.location}
                      onChange={(e) => setNewFacility({ ...newFacility, location: e.target.value })}
                      placeholder={tr(
                        "Ej: Madrid · Sede principal",
                        "e.g. Madrid · Main venue",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Capacidad", "Capacity")}</Label>
                    <Input
                      type="number"
                      value={newFacility.capacity}
                      onChange={(e) => setNewFacility({ ...newFacility, capacity: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{tr("Sección principal", "Primary section")}</Label>
                    <Select
                      value={newFacility.sectionId}
                      onValueChange={(v) => setNewFacility({ ...newFacility, sectionId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={tr("Selecciona sección", "Select section")} />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!newFacility.name.trim()) return;
                      addFacility({
                        name: newFacility.name.trim(),
                        location: newFacility.location || "—",
                        sportSections: newFacility.sectionId ? [newFacility.sectionId] : [],
                        status: "Active",
                        capacity: newFacility.capacity ? Number(newFacility.capacity) : undefined,
                      });
                      setNewFacility({ name: "", location: "", capacity: "", sectionId: "" });
                      toast.success(tr("Instalación añadida", "Facility added"));
                    }}
                  >
                    {tr("Crear", "Create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Hero — replica exacta de la captura 1 SAITO real */}
      <ClubHero
        usersByRole={usersByRole}
        facilities={facilities.slice(0, 3)}
        totalFacilities={facilities.length}
      />

      <div className="space-y-6">

        {/* 1. Usuarios y permisos */}
        <Section title={tr("Usuarios y permisos", "Users and permissions")} icon={ShieldCheck}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <RoleCard
              icon={UserCog}
              label={tr("Gestores / Dirección", "Managers / Direction")}
              count={usersByRole.managers}
              tone="bg-indigo-50 text-indigo-700"
            />
            <RoleCard
              icon={Building2}
              label={tr("Administración", "Administration")}
              count={usersByRole.admins}
              tone="bg-blue-50 text-blue-700"
            />
            <RoleCard
              icon={Stethoscope}
              label={tr("Staff médico", "Medical staff")}
              count={usersByRole.medical}
              tone="bg-rose-50 text-rose-700"
            />
            <RoleCard
              icon={Wrench}
              label={tr("Staff técnico", "Technical staff")}
              count={usersByRole.technical}
              tone="bg-amber-50 text-amber-700"
            />
            <RoleCard
              icon={Users}
              label={tr("Deportistas", "Athletes")}
              count={usersByRole.athletes}
              tone="bg-emerald-50 text-emerald-700"
            />
            <RoleCard
              icon={Baby}
              label={tr("Tutores", "Tutors")}
              count={usersByRole.tutors}
              tone="bg-violet-50 text-violet-700"
            />
          </div>
        </Section>

        {/* 2. Instalaciones */}
        <Section title={tr("Instalaciones", "Facilities")} icon={MapPin}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((f) => (
              <Card key={f.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{f.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {f.location}
                    </div>
                  </div>
                  <button
                    aria-label={tr("Eliminar instalación", "Delete facility")}
                    onClick={() => {
                      deleteFacility(f.id);
                      toast.success(tr("Instalación eliminada", "Facility deleted"));
                    }}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {f.sportSections.map((sid) => {
                    const s = sections.find((x) => x.id === sid);
                    return s ? <Pill key={sid}>{s.name}</Pill> : null;
                  })}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-600">
                    <span className="text-xs text-slate-400">{tr("Capacidad", "Capacity")}</span>
                    <div className="font-medium">{f.capacity ?? "—"}</div>
                  </div>
                  <div className="text-right text-slate-600">
                    <span className="text-xs text-slate-400">{tr("Próximo uso", "Next use")}</span>
                    <div className="font-medium">{f.nextActivity ?? "—"}</div>
                  </div>
                </div>
              </Card>
            ))}
            {facilities.length === 0 && (
              <Card className="text-sm text-slate-500">
                {tr("Sin instalaciones todavía.", "No facilities yet.")}
              </Card>
            )}
          </div>
        </Section>

        {/* 3. Organigrama deportivo */}
        <Section title={tr("Organigrama deportivo", "Sports org chart")} icon={Layers}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sectionStats.map((s) => (
              <Card key={s.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{tr("Sección deportiva", "Sports section")}</div>
                  </div>
                  <button
                    aria-label={tr("Eliminar sección", "Delete section")}
                    onClick={() => {
                      if (
                        confirm(
                          tr(
                            `Eliminar la sección "${s.name}" y todos sus grupos?`,
                            `Delete section "${s.name}" and all its groups?`,
                          ),
                        )
                      ) {
                        deleteSection(s.id);
                        toast.success(tr("Sección eliminada", "Section deleted"));
                      }
                    }}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label={tr("Atletas", "Athletes")} value={s.athletes} />
                  <Stat label="Staff" value={s.staff} />
                  <Stat label={tr("Grupos", "Groups")} value={s.groups} />
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* 4. Categorías por sección */}
        <Section title={tr("Categorías", "Categories")} icon={FolderTree}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

            {sections.map((s) => {
              const cats = categories.filter((c) => c.sectionId === s.id);
              return (
                <Card key={s.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <span className="text-xs text-slate-400">
                      {tr(`${cats.length} categorías`, `${cats.length} categories`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cats.length === 0 && (
                      <span className="text-xs text-slate-400">
                        {tr("Sin categorías.", "No categories.")}
                      </span>
                    )}
                    {cats.map((c) => (
                      <span
                        key={c.id}
                        className="group inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {c.name}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                tr(
                                  `Eliminar la categoría "${c.name}"?`,
                                  `Delete category "${c.name}"?`,
                                ),
                              )
                            ) {
                              deleteCategory(c.id);
                              toast.success(tr("Categoría eliminada", "Category deleted"));
                            }
                          }}
                          className="ml-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600"
                          aria-label={tr("Eliminar categoría", "Delete category")}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        {/* 5. Grupos por categoría */}
        <Section title={tr("Grupos", "Groups")} icon={UserSquare2}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => {
              const sec = sections.find((s) => s.id === g.sectionId);
              const cat = categories.find((c) => c.id === g.categoryId);
              const groupAthletes = athletes.filter((a) => a.groupIds.includes(g.id));
              const staff = staffByGroup.get(g.id) ?? [];
              const schedule = groupSchedules.get(g.id) ?? [];
              return (
                <Card key={g.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{g.name}</div>
                      <div className="text-xs text-slate-500">
                        {sec?.name ?? "—"} · {cat?.name ?? "—"}
                      </div>
                    </div>
                    <button
                      aria-label={tr("Eliminar grupo", "Delete group")}
                      onClick={() => {
                        if (
                          confirm(
                            tr(`Eliminar el grupo "${g.name}"?`, `Delete group "${g.name}"?`),
                          )
                        ) {
                          deleteGroup(g.id);
                          toast.success(tr("Grupo eliminado", "Group deleted"));
                        }
                      }}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Stat label={tr("Atletas", "Athletes")} value={groupAthletes.length} />
                    <Stat label="Staff" value={staff.length} />
                  </div>

                  {staff.length > 0 && (
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400">Staff: </span>
                      {staff.join(", ")}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock className="h-3 w-3" /> {tr("Horario semanal", "Weekly schedule")}
                    </div>
                    {schedule.length === 0 ? (
                      <div className="text-xs text-slate-400">
                        {tr("Sin sesiones programadas.", "No sessions scheduled.")}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {schedule.map((slot) => (
                          <span
                            key={slot}
                            className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
            {groups.length === 0 && (
              <Card className="text-sm text-slate-500">
                {tr("Aún no hay grupos creados.", "No groups created yet.")}
              </Card>
            )}

          </div>
        </Section>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero superior — clona la captura 1 del SAITO real:
// Card "Usuarios y permisos" + Card "Instalaciones" + Copiloto.
// ─────────────────────────────────────────────────────────────
function ClubHero({
  usersByRole,
  facilities,
  totalFacilities,
}: {
  usersByRole: {
    managers: number;
    admins: number;
    medical: number;
    technical: number;
    athletes: number;
    tutors: number;
  };
  facilities: { id: string; name: string; location: string }[];
  totalFacilities: number;
}) {
  const tr = useTr();
  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Usuarios y permisos */}
        <div
          className="rounded-3xl border bg-card p-6 shadow-sm"
          style={{ borderColor: "#E4EAF2" }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {tr("Usuarios y permisos", "Users and permissions")}
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
              style={{ background: "var(--primary, #0067C9)" }}
            >
              <Plus className="h-4 w-4" />
              {tr("Nueva alta", "New")}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <RolePillTag
              icon={Stethoscope}
              label={tr("Staff médico", "Medical staff")}
              count={usersByRole.medical}
            />
            <RolePillTag
              icon={Wrench}
              label={tr("Staff técnico", "Technical staff")}
              count={usersByRole.technical}
            />
            <RolePillTag
              icon={Users}
              label={tr("Deportistas", "Athletes")}
              count={usersByRole.athletes}
            />
            <button
              type="button"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/70"
            >
              {tr("Ver todos", "View all")}
            </button>
          </div>
        </div>

        {/* Instalaciones */}
        <div
          className="rounded-3xl border bg-card p-6 shadow-sm"
          style={{ borderColor: "#E4EAF2" }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {tr("Instalaciones", "Facilities")}
            </h2>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm"
              style={{ background: "var(--primary, #0067C9)" }}
              aria-label={tr("Añadir instalación", "Add facility")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {facilities.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                {tr("No hay instalaciones registradas.", "No facilities registered.")}
              </li>
            ) : (
              facilities.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-2 text-base font-medium text-foreground"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{f.name}</span>
                </li>
              ))
            )}
            {totalFacilities > facilities.length && (
              <li className="text-xs text-muted-foreground">
                +{totalFacilities - facilities.length}{" "}
                {tr("más", "more")}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Copiloto */}
      <CopilotoCard suggestions={DEFAULT_ADMIN_SUGGESTIONS} />
    </div>
  );
}

function RolePillTag({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium"
      style={{ borderColor: "#E4EAF2", color: "#0F1B3D" }}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
      <span className="text-xs font-semibold text-muted-foreground">{count}</span>
    </span>
  );
}

