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
import { Plus, Building2, Users, Stethoscope, Wrench, UserSquare2, MapPin } from "lucide-react";

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
  const addSection = useData((s) => s.addSection);
  const addFacility = useData((s) => s.addFacility);

  const counts = {
    managers: users.filter((u) => u.role === "manager").length,
    medical: users.filter((u) => u.role === "medical").length,
    technical: users.filter((u) => u.role === "technical").length,
    athletes: useData.getState().athletes.length,
  };

  const [userOpen, setUserOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [facOpen, setFacOpen] = useState(false);
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <div key={f.id} className="flex items-start justify-between rounded-2xl border border-border bg-card p-4">
              <div>
                <div className="flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4 text-primary" />{f.name}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{f.location}
                </div>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15" aria-label="Add">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

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
            <Link key={s.id} to="/athletes" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="flex shrink-0 gap-1">
                  {s.managerCount != null && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">{s.managerCount}</span>}
                  {s.staffCount != null && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-success/15 px-1.5 text-[11px] font-semibold text-success">{s.staffCount}</span>}
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{s.athleteCount} {lang === "es" ? "deportistas" : "athletes"}</div>
            </Link>
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
