import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AthleteProfileSheet } from "@/components/AthleteProfileSheet";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_ATHLETES_ROWS,
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
  DEMO_GROUPS_ROWS,
  DEMO_ATHLETE_GROUPS_ROWS,
} from "@/lib/demoFallbacks";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { demoOrEmpty } from "@/lib/demoFallback";

export const Route = createFileRoute("/_app/athletes")({
  component: () => (
    <RoleGate roles={["admin", "manager", "technical", "medical"]}>
      <AppLayout>
        <AthletesPage />
      </AppLayout>
    </RoleGate>
  ),
});

type AthleteRow = {
  id: string;
  first_name: string;
  last_name: string;
  section_id: string | null;
  category_id: string | null;
  status: string;
  medical_status: string;
  performance_status: string;
};
type SectionRow = { id: string; name: string };
type CategoryRow = { id: string; name: string; section_id: string };
type GroupRow = { id: string; name: string; section_id: string; category_id: string };
type AthleteGroupRow = { athlete_id: string; group_id: string };

function AthletesPage() {
  const t = useT();
  const { roles, profile } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const qc = useQueryClient();
  const isMedical = roles.includes("medical") && !roles.includes("admin");
  const isTechnical = roles.includes("technical") && !roles.includes("admin");
  const canManage = roles.includes("admin") || roles.includes("manager");

  const athletesQ = useQuery({
    queryKey: ["athletes", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athletes")
        .select(
          "id, first_name, last_name, section_id, category_id, status, medical_status, performance_status",
        )
        .order("last_name");
      if (error) throw error;
      return (data ?? []) as AthleteRow[];
    },
  });
  const sectionsQ = useQuery({
    queryKey: ["sections", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sport_sections")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return (data ?? []) as SectionRow[];
    },
  });
  const categoriesQ = useQuery({
    queryKey: ["categories", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, section_id")
        .order("name");
      if (error) throw error;
      return (data ?? []) as CategoryRow[];
    },
  });
  const groupsQ = useQuery({
    queryKey: ["groups", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name, section_id, category_id")
        .order("name");
      if (error) throw error;
      return (data ?? []) as GroupRow[];
    },
  });
  const athleteGroupsQ = useQuery({
    queryKey: ["athlete_groups", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("athlete_groups").select("athlete_id, group_id");
      if (error) throw error;
      return (data ?? []) as AthleteGroupRow[];
    },
  });

  const athletes = demoOrEmpty(athletesQ.data, DEMO_ATHLETES_ROWS) as AthleteRow[];
  const sections = demoOrEmpty(sectionsQ.data, DEMO_SECTIONS_ROWS) as SectionRow[];
  const categories = demoOrEmpty(categoriesQ.data, DEMO_CATEGORIES_ROWS) as CategoryRow[];
  const groups = demoOrEmpty(groupsQ.data, DEMO_GROUPS_ROWS) as GroupRow[];
  const athleteGroups = demoOrEmpty(
    athleteGroupsQ.data,
    DEMO_ATHLETE_GROUPS_ROWS,
  ) as AthleteGroupRow[];
  const groupsByAthlete = (athleteId: string) =>
    athleteGroups.filter((ag) => ag.athlete_id === athleteId).map((ag) => ag.group_id);

  // ------------- Filters -------------
  const [statusF, setStatusF] = useState("all");
  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [grpF, setGrpF] = useState("all");
  const [medF, setMedF] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<AthleteRow | null>(null);

  const [newAth, setNewAth] = useState({
    firstName: "",
    lastName: "",
    sectionId: "",
    categoryId: "",
    groupId: "",
  });

  const filtered = athletes.filter((a) => {
    if (statusF !== "all" && a.status !== statusF) return false;
    if (secF !== "all" && a.section_id !== secF) return false;
    if (catF !== "all" && a.category_id !== catF) return false;
    if (grpF !== "all" && !groupsByAthlete(a.id).includes(grpF)) return false;
    if (medF !== "all" && a.medical_status !== medF) return false;
    if (q && !`${a.first_name} ${a.last_name}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  // ------------- Mutations -------------
  const createAthlete = useMutation({
    mutationFn: async (vals: typeof newAth) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("athletes")
        .insert({
          organization_id: orgId,
          first_name: vals.firstName,
          last_name: vals.lastName,
          section_id: vals.sectionId || null,
          category_id: vals.categoryId || null,
          status: "Active",
          medical_status: "Unknown",
          performance_status: "Medium",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (vals.groupId) {
        const { error: e2 } = await supabase.from("athlete_groups").insert({
          athlete_id: data.id,
          group_id: vals.groupId,
          organization_id: orgId,
        });
        if (e2) throw e2;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["athletes", orgId] });
      qc.invalidateQueries({ queryKey: ["athlete_groups", orgId] });
      toast.success(t("created") || "Created");
      setOpen(false);
      setNewAth({ firstName: "", lastName: "", sectionId: "", categoryId: "", groupId: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeAthlete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("athletes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["athletes", orgId] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const loading = !!orgId && (athletesQ.isLoading || sectionsQ.isLoading);

  return (
    <>
      <PageHeader
        title={t("athletes_management")}
        actions={
          canManage && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full">
                  <Plus className="mr-1 h-4 w-4" />
                  {t("new_athlete")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("new_athlete")}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t("name")}</Label>
                    <Input
                      value={newAth.firstName}
                      onChange={(e) => setNewAth({ ...newAth, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t("last_name")}</Label>
                    <Input
                      value={newAth.lastName}
                      onChange={(e) => setNewAth({ ...newAth, lastName: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>{t("section")}</Label>
                    <Select
                      value={newAth.sectionId}
                      onValueChange={(v) =>
                        setNewAth({ ...newAth, sectionId: v, categoryId: "", groupId: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
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
                  <div className="col-span-2">
                    <Label>{t("category")}</Label>
                    <Select
                      value={newAth.categoryId}
                      onValueChange={(v) => setNewAth({ ...newAth, categoryId: v, groupId: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.section_id === newAth.sectionId)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>{t("group")}</Label>
                    <Select
                      value={newAth.groupId}
                      onValueChange={(v) => setNewAth({ ...newAth, groupId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups
                          .filter((g) => g.category_id === newAth.categoryId)
                          .map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button
                    disabled={createAthlete.isPending || !newAth.firstName || !newAth.lastName}
                    onClick={() => createAthlete.mutate(newAth)}
                  >
                    {t("save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="w-56 rounded-full pl-9"
          />
        </div>
        {!isMedical && (
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-40 rounded-full">
              <SelectValue placeholder={t("all_statuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_statuses")}</SelectItem>
              {["Active", "Inactive", "Pending"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={secF}
          onValueChange={(v) => {
            setSecF(v);
            setCatF("all");
            setGrpF("all");
          }}
        >
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={t("all_sections")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_sections")}</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={catF}
          onValueChange={(v) => {
            setCatF(v);
            setGrpF("all");
          }}
        >
          <SelectTrigger className="w-40 rounded-full">
            <SelectValue placeholder={t("all_categories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories
              .filter((c) => secF === "all" || c.section_id === secF)
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!isMedical && (
          <Select value={grpF} onValueChange={setGrpF}>
            <SelectTrigger className="w-40 rounded-full">
              <SelectValue placeholder={t("all_groups")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_groups")}</SelectItem>
              {groups
                .filter(
                  (g) =>
                    (secF === "all" || g.section_id === secF) &&
                    (catF === "all" || g.category_id === catF),
                )
                .map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        <Select value={medF} onValueChange={setMedF}>
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder={t("medical_status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("medical_status")}</SelectItem>
            {["Fit", "Injured", "Under review", "Unknown"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState>{t("no_athletes")}</EmptyState>
      ) : (
        <div className="saito-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">{t("name")}</th>
                <th className="px-5 py-3 font-semibold">{t("section")}</th>
                <th className="px-5 py-3 font-semibold">{t("category")}</th>
                {!isMedical && <th className="px-5 py-3 font-semibold">{t("groups")}</th>}
                {isTechnical && <th className="px-5 py-3 font-semibold">{t("performance")}</th>}
                <th className="px-5 py-3 font-semibold">
                  {isMedical || isTechnical ? t("medical_status") : t("status")}
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const sec = sections.find((s) => s.id === a.section_id);
                const cat = categories.find((c) => c.id === a.category_id);
                const grpIds = groupsByAthlete(a.id);
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">
                      {a.first_name} {a.last_name.toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{sec?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{cat?.name ?? "—"}</td>
                    {!isMedical && (
                      <td className="px-5 py-3 text-muted-foreground">
                        {grpIds
                          .map((id) => groups.find((g) => g.id === id)?.name)
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>
                    )}
                    {isTechnical && (
                      <td className="px-5 py-3">
                        <Pill
                          tone={
                            a.performance_status === "High"
                              ? "success"
                              : a.performance_status === "Low"
                                ? "warning"
                                : "info"
                          }
                        >
                          {a.performance_status}
                        </Pill>
                      </td>
                    )}
                    <td className="px-5 py-3">
                      {isMedical || isTechnical ? (
                        <Pill
                          tone={
                            a.medical_status === "Fit"
                              ? "success"
                              : a.medical_status === "Injured"
                                ? "danger"
                                : a.medical_status === "Under review"
                                  ? "warning"
                                  : "default"
                          }
                        >
                          {a.medical_status}
                        </Pill>
                      ) : (
                        <Pill
                          tone={
                            a.status === "Active"
                              ? "success"
                              : a.status === "Pending"
                                ? "warning"
                                : "default"
                          }
                        >
                          {a.status}
                        </Pill>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(a)}>
                        {t("view_profile")}
                      </Button>
                      {canManage && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm(t("delete_confirm"))) removeAthlete.mutate(a.id);
                          }}
                        >
                          {t("delete")}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {detail && (
            <AthleteProfileSheet
              athlete={detail}
              roles={roles}
              sectionName={sections.find((s) => s.id === detail.section_id)?.name ?? "—"}
              categoryName={categories.find((c) => c.id === detail.category_id)?.name ?? "—"}
              groupNames={groupsByAthlete(detail.id)
                .map((id) => groups.find((g) => g.id === id)?.name)
                .filter((x): x is string => Boolean(x))}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
