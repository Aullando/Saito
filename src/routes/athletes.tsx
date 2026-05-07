import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser, useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Athlete, AthleteStatus, MedicalStatus } from "@/lib/types";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/athletes")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <AthletesPage />
      </AppLayout>
    </RoleGate>
  ),
});

function AthletesPage() {
  const t = useT();
  const u = useCurrentUser()!;
  const isMedical = u.role === "medical";
  const isTechnical = u.role === "technical";
  const athletes = useData((s) => s.athletes);
  const sections = useData((s) => s.sections);
  const categories = useData((s) => s.categories);
  const groups = useData((s) => s.groups);
  const payments = useData((s) => s.payments);
  const events = useData((s) => s.events);
  const appointments = useData((s) => s.appointments);
  const addAthlete = useData((s) => s.addAthlete);
  const addAppointmentNote = useData((s) => s.addAppointmentNote);

  const [statusF, setStatusF] = useState("all");
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [medF, setMedF] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Athlete | null>(null);
  const [note, setNote] = useState("");

  const [newAth, setNewAth] = useState({ firstName: "", lastName: "", sectionId: sections[0]?.id ?? "", categoryId: "", groupId: "" });

  const filtered = athletes.filter((a) => {
    if (statusF !== "all" && a.status !== statusF) return false;
    if (secF !== "all" && a.sectionId !== secF) return false;
    if (catF !== "all" && a.categoryId !== catF) return false;
    if (grpF !== "all" && !a.groupIds.includes(grpF)) return false;
    if (medF !== "all" && a.medicalStatus !== medF) return false;
    if (q && !`${a.firstName} ${a.lastName}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const detailPayments = detail ? payments.filter((p) => p.athleteId === detail.id) : [];
  const detailEvents = detail ? events.filter((e) => e.sectionId === detail.sectionId).slice(0, 4) : [];
  const detailAppts = detail ? appointments.filter((a) => a.athleteId === detail.id) : [];

  return (
    <>
      <PageHeader
        title={t("athletes_management")}
        actions={!isMedical && !isTechnical && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" />{t("new_athlete")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t("new_athlete")}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t("name")}</Label><Input value={newAth.firstName} onChange={(e) => setNewAth({ ...newAth, firstName: e.target.value })} /></div>
                <div><Label>Apellido</Label><Input value={newAth.lastName} onChange={(e) => setNewAth({ ...newAth, lastName: e.target.value })} /></div>
                <div className="col-span-2">
                  <Label>{t("section")}</Label>
                  <Select value={newAth.sectionId} onValueChange={(v) => setNewAth({ ...newAth, sectionId: v, categoryId: "", groupId: "" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{sections.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>{t("category")}</Label>
                  <Select value={newAth.categoryId} onValueChange={(v) => setNewAth({ ...newAth, categoryId: v, groupId: "" })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>{categories.filter((c) => c.sectionId === newAth.sectionId).map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>{t("group")}</Label>
                  <Select value={newAth.groupId} onValueChange={(v) => setNewAth({ ...newAth, groupId: v })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>{groups.filter((g) => g.categoryId === newAth.categoryId).map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => {
                  if (!newAth.firstName || !newAth.categoryId || !newAth.groupId) return;
                  addAthlete({ firstName: newAth.firstName, lastName: newAth.lastName, sectionId: newAth.sectionId, categoryId: newAth.categoryId, groupIds: [newAth.groupId], status: "Active", medicalStatus: "Unknown", performanceStatus: "Medium" });
                  setNewAth({ firstName: "", lastName: "", sectionId: sections[0]?.id ?? "", categoryId: "", groupId: "" });
                  setOpen(false);
                }}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="w-56 rounded-full pl-9" />
        </div>
        {!isMedical && (
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder={t("all_statuses")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_statuses")}</SelectItem>
              {(["Active", "Inactive", "Pending"] as AthleteStatus[]).map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        )}
        <Select value={secF} onValueChange={(v) => { setSecF(v); setCatF("all"); setGrpF("all"); }}>
          <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder={t("all_sections")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_sections")}</SelectItem>
            {sections.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={catF} onValueChange={(v) => { setCatF(v); setGrpF("all"); }}>
          <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder={t("all_categories")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories.filter((c) => secF === "all" || c.sectionId === secF).map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
        {!isMedical && (
          <Select value={grpF} onValueChange={setGrpF}>
            <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder={t("all_groups")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_groups")}</SelectItem>
              {groups.filter((g) => (secF === "all" || g.sectionId === secF) && (catF === "all" || g.categoryId === catF)).map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
            </SelectContent>
          </Select>
        )}
        <Select value={medF} onValueChange={setMedF}>
          <SelectTrigger className="w-44 rounded-full"><SelectValue placeholder={t("medical_status")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("medical_status")}</SelectItem>
            {(["Fit", "Injured", "Under review", "Unknown"] as MedicalStatus[]).map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>{t("no_athletes")}</EmptyState>
      ) : (
        <div className="saito-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">{t("name")}</th>
                <th className="px-5 py-3 font-semibold">{t("section")}</th>
                <th className="px-5 py-3 font-semibold">{t("category")}</th>
                <th className="px-5 py-3 font-semibold">{t("groups")}</th>
                {isTechnical && <th className="px-5 py-3 font-semibold">{t("performance")}</th>}
                <th className="px-5 py-3 font-semibold">{isMedical || isTechnical ? t("medical_status") : t("status")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const sec = sections.find((s) => s.id === a.sectionId);
                const cat = categories.find((c) => c.id === a.categoryId);
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{a.firstName} {a.lastName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{sec?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{cat?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.groupIds.map((id) => groups.find((g) => g.id === id)?.name).join(", ")}</td>
                    {isTechnical && <td className="px-5 py-3"><Pill tone={a.performanceStatus === "High" ? "success" : a.performanceStatus === "Low" ? "warning" : "info"}>{a.performanceStatus}</Pill></td>}
                    <td className="px-5 py-3">
                      {(isMedical || isTechnical) ? (
                        <Pill tone={a.medicalStatus === "Fit" ? "success" : a.medicalStatus === "Injured" ? "danger" : a.medicalStatus === "Under review" ? "warning" : "default"}>{a.medicalStatus}</Pill>
                      ) : (
                        <Pill tone={a.status === "Active" ? "success" : a.status === "Pending" ? "warning" : "default"}>{a.status}</Pill>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(a)}>{t("view_profile")}</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detail && (
            <>
              <SheetHeader><SheetTitle>{detail.firstName} {detail.lastName}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-5 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Pill tone="info">{sections.find((s) => s.id === detail.sectionId)?.name}</Pill>
                  <Pill>{categories.find((c) => c.id === detail.categoryId)?.name}</Pill>
                  <Pill tone={detail.status === "Active" ? "success" : "default"}>{detail.status}</Pill>
                  <Pill tone={detail.medicalStatus === "Fit" ? "success" : detail.medicalStatus === "Injured" ? "danger" : "warning"}>{detail.medicalStatus}</Pill>
                </div>

                {!isMedical && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("payment_status")}</h3>
                    <ul className="space-y-1.5">
                      {detailPayments.length === 0 && <li className="text-muted-foreground">—</li>}
                      {detailPayments.map((p) => (
                        <li key={p.id} className="flex justify-between rounded-lg border border-border bg-card px-3 py-2">
                          <span>{p.subscription} · {p.date}</span>
                          <Pill tone={p.status === "Paid" ? "success" : p.status === "Failed" ? "danger" : "warning"}>{p.status}</Pill>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próximos eventos</h3>
                  <ul className="space-y-1.5">
                    {detailEvents.length === 0 && <li className="text-muted-foreground">—</li>}
                    {detailEvents.map((e) => (
                      <li key={e.id} className="rounded-lg border border-border bg-card px-3 py-2">{e.date} · {e.startTime} · {e.title}</li>
                    ))}
                  </ul>
                </section>

                {isMedical && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Historial de citas</h3>
                    <ul className="space-y-1.5">
                      {detailAppts.length === 0 && <li className="text-muted-foreground">—</li>}
                      {detailAppts.map((a) => (
                        <li key={a.id} className="rounded-lg border border-border bg-card px-3 py-2">
                          <div className="flex justify-between"><span>{a.date} · {a.time}</span><Pill tone="info">{a.status}</Pill></div>
                          <div className="mt-1 text-muted-foreground">{a.reason}</div>
                          {a.notes && <div className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{a.notes}</div>}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 space-y-2">
                      <Label>{t("add_medical_note")}</Label>
                      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Observaciones…" />
                      <Button size="sm" onClick={() => {
                        if (!note.trim() || detailAppts.length === 0) return;
                        addAppointmentNote(detailAppts[0].id, note);
                        setNote("");
                      }}>{t("save")}</Button>
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
