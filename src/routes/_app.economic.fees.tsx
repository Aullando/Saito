import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, EmptyState } from "@/components/ui-kit";
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
import { useT, useTr, useLang } from "@/lib/i18n";
import { useTd } from "@/lib/demoI18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { formatMoneyEs, formatDate } from "@/lib/format";
import { frequencyLabel } from "@/lib/labels";
import { isDemoMode } from "@/lib/appMode";
import { useData } from "@/lib/store";
import { useDemoFeeRows } from "@/lib/demoStoreRows";

export const Route = createFileRoute("/_app/economic/fees")({
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <FeesPage />
      </AppLayout>
    </RoleGate>
  ),
});

interface DBFee {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  period_start: string | null;
  period_end: string | null;
  payment_date: string | null;
  applies_to_group_ids: string[] | null;
  section_id: string | null;
  kind: "fee" | "rate";
}

function FeesPage() {
  const t = useT();
  const tr = useTr();
  const lang = useLang();
  const { profile } = useAuth();
  const orgId = profile?.organization_id;
  const qc = useQueryClient();
  const demo = isDemoMode();
  const storeFees = useDemoFeeRows();
  const storeSections = useData((s) => s.sections);
  const storeGroups = useData((s) => s.groups);
  const addFeeStore = useData((s) => s.addFee);
  const delFeeStore = useData((s) => s.deleteFee);

  const sectionsQ = useQuery({
    queryKey: ["sport_sections", orgId],
    enabled: !!orgId && !demo,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sport_sections")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const groupsQ = useQuery({
    queryKey: ["groups", orgId],
    enabled: !!orgId && !demo,
    queryFn: async () => {
      const { data, error } = await supabase.from("groups").select("id, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const feesQ = useQuery({
    queryKey: ["fees", orgId],
    enabled: !!orgId && !demo,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fees")
        .select(
          "id, name, amount, frequency, period_start, period_end, payment_date, applies_to_group_ids, section_id, kind",
        )
        .order("name");
      if (error) throw error;
      return (data ?? []) as DBFee[];
    },
  });

  const sections = demo
    ? storeSections.map((s) => ({ id: s.id, name: s.name }))
    : sectionsQ.data ?? [];
  const groups = demo ? storeGroups.map((g) => ({ id: g.id, name: g.name })) : groupsQ.data ?? [];
  const fees = demo ? storeFees : feesQ.data ?? [];

  const [activeSec, setActiveSec] = useState("");
  useEffect(() => {
    if (!activeSec && sections.length) setActiveSec(sections[0].id);
  }, [sections, activeSec]);

  const [form, setForm] = useState({
    name: "",
    amount: 0,
    frequency: "Monthly",
    period_start: "",
    period_end: "",
    kind: "fee" as "fee" | "rate",
  });

  const addFee = useMutation({
    mutationFn: async () => {
      if (!form.name) throw new Error(tr("Nombre requerido", "Name required", "Naziv je obavezan"));
      if (demo) {
        addFeeStore({
          name: form.name,
          amount: form.amount,
          frequency: form.frequency as "Monthly" | "Quarterly" | "Annual" | "One-time",
          periodStart: form.period_start || undefined,
          periodEnd: form.period_end || undefined,
          appliesToGroupIds: [],
          sectionId: activeSec,
          kind: form.kind,
        });
        return;
      }
      const { error } = await supabase.from("fees").insert({
        organization_id: orgId!,
        section_id: activeSec,
        name: form.name,
        amount: form.amount,
        frequency: form.frequency,
        period_start: form.period_start || null,
        period_end: form.period_end || null,
        kind: form.kind,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Cuota creada", "Fee created", "Kotizacija je kreirana"));
      setForm({
        name: "",
        amount: 0,
        frequency: "Monthly",
        period_start: "",
        period_end: "",
        kind: form.kind,
      });
      qc.invalidateQueries({ queryKey: ["fees", orgId] });
    },
    onError: (e: Error) =>
      toast.error(
        e.message || tr("No se pudo crear", "Could not create", "Kreiranje nije uspelo"),
      ),
  });

  const delFee = useMutation({
    mutationFn: async (id: string) => {
      if (demo) {
        delFeeStore(id);
        return;
      }
      const { error } = await supabase.from("fees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tr("Cuota eliminada", "Fee deleted", "Kotizacija je obrisana"));
      qc.invalidateQueries({ queryKey: ["fees", orgId] });
    },
    onError: () => toast.error(tr("No se pudo eliminar", "Could not delete", "Brisanje nije uspelo")),
  });

  const sectionFees = fees.filter((f) => f.section_id === activeSec);

  return (
    <>
      <PageHeader title={t("fees_rates")} />

      <div className="mb-5 flex flex-wrap gap-2">
        {sections.map((s) => {
          const isActive = activeSec === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSec(s.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-foreground hover:bg-muted border border-border"}`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("fees")}</h2>
            <span className="text-xs text-muted-foreground">
              {sectionFees.filter((f) => f.kind === "fee").length} {t("records")}
            </span>
          </div>
          <FeeTable
            rows={sectionFees.filter((f) => f.kind === "fee")}
            kind="fee"
            t={t}
            groups={groups}
            lang={lang}
            onDelete={(id) => delFee.mutate(id)}
          />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("other_rates")}</h2>
            <span className="text-xs text-muted-foreground">
              {sectionFees.filter((f) => f.kind === "rate").length} {t("records")}
            </span>
          </div>
          <FeeTable
            rows={sectionFees.filter((f) => f.kind === "rate")}
            kind="rate"
            t={t}
            groups={groups}
            lang={lang}
            onDelete={(id) => delFee.mutate(id)}
          />
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold">{t("add_fee")}</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Label>{t("fee_name")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("amount")} (€)</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>{t("frequency")}</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) => setForm({ ...form, frequency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Monthly", "Quarterly", "Annual", "One-time"] as const).map((f) => (
                    <SelectItem key={f} value={f}>
                      {frequencyLabel(f, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("category")}</Label>
              <Select
                value={form.kind}
                onValueChange={(v) => setForm({ ...form, kind: v as "fee" | "rate" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fee">{t("fees")}</SelectItem>
                  <SelectItem value="rate">{t("other_rates")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{tr("Desde", "From", "Od")}</Label>
              <Input
                type="date"
                value={form.period_start}
                onChange={(e) => setForm({ ...form, period_start: e.target.value })}
              />
            </div>
            <div>
              <Label>{tr("Hasta", "To", "Do")}</Label>
              <Input
                type="date"
                value={form.period_end}
                onChange={(e) => setForm({ ...form, period_end: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              className="rounded-full"
              disabled={!activeSec || addFee.isPending}
              onClick={() => addFee.mutate()}
            >
              <Plus className="mr-1 h-4 w-4" />
              {t("add_fee")}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function FeeTable({
  rows,
  kind,
  t,
  groups,
  lang,
  onDelete,
}: {
  rows: DBFee[];
  kind: "fee" | "rate";
  t: (k: string) => string;
  groups: { id: string; name: string }[];
  lang: "es" | "en" | "sr";
  onDelete: (id: string) => void;
}) {
  if (rows.length === 0) return <EmptyState>—</EmptyState>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <th className="px-2 py-2 font-semibold">
              {kind === "fee" ? t("fee_name") : t("rate_name")}
            </th>
            <th className="px-2 py-2 font-semibold">{t("amount")}</th>
            {kind === "fee" ? (
              <th className="px-2 py-2 font-semibold">{t("frequency")}</th>
            ) : (
              <th className="px-2 py-2 font-semibold">{t("payment_date")}</th>
            )}
            {kind === "fee" && <th className="px-2 py-2 font-semibold">{t("period")}</th>}
            <th className="px-2 py-2 font-semibold">{t("applies_to")}</th>
            <th className="px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-2 py-2.5 font-medium">{f.name}</td>
              <td className="px-2 py-2.5">{formatMoneyEs(Number(f.amount))}</td>
              {kind === "fee" ? (
                <td className="px-2 py-2.5">{frequencyLabel(f.frequency as "Monthly", lang)}</td>
              ) : (
                <td className="px-2 py-2.5">{f.payment_date ? formatDate(f.payment_date) : "—"}</td>
              )}
              {kind === "fee" && (
                <td className="px-2 py-2.5 text-muted-foreground">
                  {f.period_start ? formatDate(f.period_start) : "—"} →{" "}
                  {f.period_end ? formatDate(f.period_end) : "—"}
                </td>
              )}
              <td className="px-2 py-2.5 text-muted-foreground">
                {!f.applies_to_group_ids || f.applies_to_group_ids.length === 0
                  ? t("all_groups" as any)
                  : f.applies_to_group_ids
                      .map((id) => groups.find((g) => g.id === id)?.name)
                      .join(", ")}
              </td>
              <td className="px-2 py-2.5 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm(t("delete_confirm"))) onDelete(f.id);
                  }}
                >
                  {t("delete")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
