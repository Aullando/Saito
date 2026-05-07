import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser, useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Role } from "@/lib/types";
import { Plus, Building2, Users, Stethoscope, Wrench, UserSquare2, MapPin, Trash2 } from "lucide-react";

export const Route = createFileRoute("/club")({
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
  const u = useCurrentUser()!;
  const lang = u.language;
  const sections = useData((s) => s.sections);
  const facilities = useData((s) => s.facilities);
  const users = useData((s) => s.users);
  const addUser = useData((s) => s.addUser);
  const deleteUser = useData((s) => s.deleteUser);
  const addSection = useData((s) => s.addSection);
  const deleteSection = useData((s) => s.deleteSection);
  const addFacility = useData((s) => s.addFacility);
  const deleteFacility = useData((s) => s.deleteFacility);

  const counts = {
    managers: users.filter((u) => u.role === "manager").length,
    medical: users.filter((u) => u.role === "medical").length,
    technical: users.filter((u) => u.role === "technical").length,
    athletes: useData.getState().athletes.length,
  };

  const [userOpen, setUserOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [facOpen, setFacOpen] = useState(false);
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  const [newU, setNewU] = useState({ name: "", email: "", role: "technical" as Role });
  const [newSec, setNewSec] = useState("");
  const [newFac, setNewFac] = useState({ name: "", location: "" });

  return (
    <>
      <PageHeader
        title={t("club_organization")}
        subtitle={lang === "es" ? "Vista general del club, instalaciones y secciones." : "Overview of club, facilities and sections."}
      />

      {/* Users & Permissions */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("users_permissions")}</h2>
          <Dialog open={userOpen} onOpenChange={setUserOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("new_user")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new_user")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t("name")}</Label><Input value={newU.name} onChange={(e) => setNewU({ ...newU, name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={newU.email} onChange={(e) => setNewU({ ...newU, email: e.target.value })} /></div>
                <div>
                  <Label>Role</Label>
                  <Select value={newU.role} onValueChange={(v) => setNewU({ ...newU, role: v as Role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="technical">Technical staff</SelectItem>
                      <SelectItem value="medical">Medical staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUserOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => { if (!newU.name) return; addUser({ name: newU.name, email: newU.email || `${newU.name.toLowerCase().replace(/\s/g, ".")}@saito.demo`, role: newU.role, language: lang }); setNewU({ name: "", email: "", role: "technical" }); setUserOpen(false); }}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <RoleCard icon={UserSquare2} label={t("managers")} value={counts.managers} />
          <RoleCard icon={Stethoscope} label={t("medical_staff")} value={counts.medical} />
          <RoleCard icon={Wrench} label={t("technical_staff")} value={counts.technical} />
          <RoleCard icon={Users} label={t("athletes")} value={counts.athletes} />
          <Link to="/athletes" className="flex items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-sm font-medium text-primary hover:bg-primary/10">
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
              <Button size="sm" variant="outline" className="rounded-full"><Plus className="mr-1 h-4 w-4" />{lang === "es" ? "Nueva instalación" : "New facility"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{lang === "es" ? "Nueva instalación" : "New facility"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>{t("name")}</Label><Input value={newFac.name} onChange={(e) => setNewFac({ ...newFac, name: e.target.value })} /></div>
                <div><Label>{lang === "es" ? "Ubicación" : "Location"}</Label><Input value={newFac.location} onChange={(e) => setNewFac({ ...newFac, location: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFacOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => { if (!newFac.name) return; addFacility({ name: newFac.name, location: newFac.location, sportSections: [], status: "Active" }); setNewFac({ name: "", location: "" }); setFacOpen(false); }}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <div key={f.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-primary hover:shadow-sm">
              <button onClick={() => setActiveFacility(f.id)} className="block w-full text-left">
                {f.photoUrl && (
                  <div className="relative h-28 w-full overflow-hidden bg-muted">
                    <img src={f.photoUrl} alt={f.name} className="h-full w-full object-cover transition group-hover:scale-[1.03]" loading="lazy" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4 text-primary" />{f.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{f.address ?? f.location}
                  </div>
                  {f.sports && f.sports.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {f.sports.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>
                      ))}
                    </div>
                  )}
                  {f.nextActivity && (
                    <div className="mt-3 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">{lang === "es" ? "Próx." : "Next"}:</span> {f.nextActivity}
                    </div>
                  )}
                  {f.capacity && (
                    <div className="mt-1 text-[11px] text-muted-foreground">{lang === "es" ? "Aforo" : "Capacity"}: {f.capacity}</div>
                  )}
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm(t("delete_confirm"))) deleteFacility(f.id); }}
                className="absolute right-2 top-2 rounded-full bg-card/80 p-1.5 text-destructive opacity-0 backdrop-blur transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                aria-label={t("delete")}
              ><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </Card>

      <FacilityDrawer id={activeFacility} onClose={() => setActiveFacility(null)} />

      {/* Organization chart / Sections */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("sports_sections")}</h2>
            <p className="text-xs text-muted-foreground">{t("organization_chart")}</p>
          </div>
          <Dialog open={secOpen} onOpenChange={setSecOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("new_section")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new_section")}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Label>{t("name")}</Label>
                <Input value={newSec} onChange={(e) => setNewSec(e.target.value)} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSecOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => { if (!newSec.trim()) return; addSection(newSec); setNewSec(""); setSecOpen(false); }}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sections.map((s) => (
            <div key={s.id} className="group relative rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm">
              <Link to="/athletes" className="block">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="flex shrink-0 gap-1">
                    {s.managerCount != null && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">{s.managerCount}</span>}
                    {s.staffCount != null && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-success/15 px-1.5 text-[11px] font-semibold text-success">{s.staffCount}</span>}
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{s.athleteCount} {lang === "es" ? "deportistas" : "athletes"}</div>
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm(t("delete_confirm"))) deleteSection(s.id); }}
                className="absolute right-2 top-2 rounded-full p-1.5 text-destructive opacity-0 transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                aria-label={t("delete")}
              ><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function RoleCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
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

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function FacilityDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const facilities = useData((s) => s.facilities);
  const events = useData((s) => s.events);
  const sections = useData((s) => s.sections);
  const f = facilities.find((x) => x.id === id) ?? null;
  // Filter events by sections linked to facility
  const linked = f?.sportSections ?? [];
  const upcoming = events.filter((e) => e.sectionId && linked.includes(e.sectionId)).slice(0, 8);
  return (
    <Sheet open={!!f} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {f && (
          <>
            <SheetHeader><SheetTitle>{f.name}</SheetTitle></SheetHeader>
            {f.photoUrl && <img src={f.photoUrl} alt={f.name} className="mt-4 h-44 w-full rounded-2xl object-cover" />}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Dirección</dt><dd className="text-right">{f.address}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Aforo</dt><dd>{f.capacity}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Deportes</dt><dd className="text-right">{f.sports?.join(", ")}</dd></div>
            </dl>
            <h3 className="mt-6 mb-2 text-sm font-semibold">Próximas actividades</h3>
            <ul className="space-y-1.5 text-xs">
              {upcoming.length === 0 && <li className="text-muted-foreground">Sin actividades próximas.</li>}
              {upcoming.map((e) => {
                const sec = sections.find((s) => s.id === e.sectionId);
                return (
                  <li key={e.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="font-medium">{e.startTime} · {e.title}</span>
                    <span className="text-muted-foreground">{sec?.name}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
