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
import { useData } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Fee } from "@/lib/types";
import { Plus } from "lucide-react";

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
  const sections = useData((s) => s.sections);
  const groups = useData((s) => s.groups);
  const fees = useData((s) => s.fees);
  const addFee = useData((s) => s.addFee);

  const [activeSec, setActiveSec] = useState(sections[0]?.id ?? "");
  const [form, setForm] = useState<Omit<Fee, "id">>({
    name: "", amount: 0, frequency: "Monthly", periodStart: "", periodEnd: "",
    appliesToGroupIds: [], sectionId: activeSec, kind: "fee",
  });

  const sectionFees = fees.filter((f) => f.sectionId === activeSec);

  return (
    <>
      <PageHeader title={t("fees_rates")} />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="saito-card p-3">
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => { setActiveSec(s.id); setForm((f) => ({ ...f, sectionId: s.id })); }}
                  className={`w-full rounded-full px-3 py-2 text-left text-sm font-medium ${activeSec === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >{s.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("fees")}</h2>
            <FeeTable rows={sectionFees.filter((f) => f.kind === "fee")} kind="fee" t={t} groups={groups} />
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-semibold">{t("other_rates")}</h2>
            <FeeTable rows={sectionFees.filter((f) => f.kind === "rate")} kind="rate" t={t} groups={groups} />
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
                    {(["Monthly", "Quarterly", "Annual", "One-time"] as const).map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
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
      </div>
    </>
  );
}

function FeeTable({ rows, kind, t, groups }: { rows: Fee[]; kind: "fee" | "rate"; t: any; groups: any[] }) {
  if (rows.length === 0) return <EmptyState>—</EmptyState>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <th className="px-2 py-2">{kind === "fee" ? t("fee_name") : t("rate_name")}</th>
          <th className="px-2 py-2">{t("amount")}</th>
          {kind === "fee" ? <th className="px-2 py-2">{t("frequency")}</th> : <th className="px-2 py-2">{t("payment_date")}</th>}
          {kind === "fee" && <th className="px-2 py-2">{t("period")}</th>}
          <th className="px-2 py-2">{t("applies_to")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.id} className="border-t border-border">
            <td className="px-2 py-2 font-medium">{f.name}</td>
            <td className="px-2 py-2">€{f.amount}</td>
            {kind === "fee" ? <td className="px-2 py-2">{f.frequency}</td> : <td className="px-2 py-2">{f.paymentDate ?? "—"}</td>}
            {kind === "fee" && <td className="px-2 py-2 text-muted-foreground">{f.periodStart ?? "—"} → {f.periodEnd ?? "—"}</td>}
            <td className="px-2 py-2 text-muted-foreground">{f.appliesToGroupIds.length === 0 ? "All" : f.appliesToGroupIds.map((id) => groups.find((g) => g.id === id)?.name).join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
