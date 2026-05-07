import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Card, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useData, useCurrentUser } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Fee } from "@/lib/types";
import { Plus } from "lucide-react";
import { formatMoneyEs, formatDate } from "@/lib/format";
import { frequencyLabel } from "@/lib/labels";

export const Route = createFileRoute("/economic/fees")({
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <FeesPage />
      </AppLayout>
    </RoleGate>
  ),
});

function FeesPage() {
  const t = useT();
  const lang = useCurrentUser()?.language ?? "es";
  const sections = useData((s) => s.sections);
  const groups = useData((s) => s.groups);
  const fees = useData((s) => s.fees);
  const addFee = useData((s) => s.addFee);
  const deleteFee = useData((s) => s.deleteFee);

  const [activeSec, setActiveSec] = useState(sections[0]?.id ?? "");
  const [form, setForm] = useState<Omit<Fee, "id">>({
    name: "", amount: 0, frequency: "Monthly", periodStart: "", periodEnd: "",
    appliesToGroupIds: [], sectionId: activeSec, kind: "fee",
  });

  const sectionFees = fees.filter((f) => f.sectionId === activeSec);

  return (
    <>
      <PageHeader title={t("fees_rates")} />

      <div className="mb-5 flex flex-wrap gap-2">
        {sections.map((s) => {
          const isActive = activeSec === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { setActiveSec(s.id); setForm((f) => ({ ...f, sectionId: s.id })); }}
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
            <span className="text-xs text-muted-foreground">{sectionFees.filter((f) => f.kind === "fee").length} {t("records")}</span>
          </div>
          <FeeTable rows={sectionFees.filter((f) => f.kind === "fee")} kind="fee" t={t} groups={groups} lang={lang} onDelete={deleteFee} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("other_rates")}</h2>
            <span className="text-xs text-muted-foreground">{sectionFees.filter((f) => f.kind === "rate").length} {t("records")}</span>
          </div>
          <FeeTable rows={sectionFees.filter((f) => f.kind === "rate")} kind="rate" t={t} groups={groups} lang={lang} onDelete={deleteFee} />
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold">{t("add_fee")}</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div><Label>{t("fee_name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>{t("amount")} (€)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
            <div>
              <Label>{t("frequency")}</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v as Fee["frequency"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Monthly", "Quarterly", "Annual", "One-time"] as const).map((f) => (<SelectItem key={f} value={f}>{frequencyLabel(f, lang)}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as "fee" | "rate" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fee">{t("fees")}</SelectItem>
                  <SelectItem value="rate">{t("other_rates")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>From</Label><Input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} /></div>
            <div><Label>To</Label><Input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="rounded-full" onClick={() => {
              if (!form.name) return;
              addFee({ ...form, sectionId: activeSec });
              setForm({ name: "", amount: 0, frequency: "Monthly", periodStart: "", periodEnd: "", appliesToGroupIds: [], sectionId: activeSec, kind: form.kind });
            }}><Plus className="mr-1 h-4 w-4" />{t("add_fee")}</Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function FeeTable({ rows, kind, t, groups, lang, onDelete }: { rows: Fee[]; kind: "fee" | "rate"; t: any; groups: any[]; lang: any; onDelete: (id: string) => void }) {
  if (rows.length === 0) return <EmptyState>—</EmptyState>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <th className="px-2 py-2 font-semibold">{kind === "fee" ? t("fee_name") : t("rate_name")}</th>
            <th className="px-2 py-2 font-semibold">{t("amount")}</th>
            {kind === "fee"
              ? <th className="px-2 py-2 font-semibold">{t("frequency")}</th>
              : <th className="px-2 py-2 font-semibold">{t("payment_date")}</th>}
            {kind === "fee" && <th className="px-2 py-2 font-semibold">{t("period")}</th>}
            <th className="px-2 py-2 font-semibold">{t("applies_to")}</th>
            <th className="px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-2 py-2.5 font-medium">{f.name}</td>
              <td className="px-2 py-2.5">{formatMoneyEs(f.amount)}</td>
              {kind === "fee"
                ? <td className="px-2 py-2.5">{frequencyLabel(f.frequency, lang)}</td>
                : <td className="px-2 py-2.5">{f.paymentDate ? formatDate(f.paymentDate) : "—"}</td>}
              {kind === "fee" && <td className="px-2 py-2.5 text-muted-foreground">{f.periodStart ? formatDate(f.periodStart) : "—"} → {f.periodEnd ? formatDate(f.periodEnd) : "—"}</td>}
              <td className="px-2 py-2.5 text-muted-foreground">{f.appliesToGroupIds.length === 0 ? "Todos" : f.appliesToGroupIds.map((id) => groups.find((g) => g.id === id)?.name).join(", ")}</td>
              <td className="px-2 py-2.5 text-right">
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm(t("delete_confirm"))) onDelete(f.id); }}>{t("delete")}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
