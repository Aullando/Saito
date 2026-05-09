import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_PAYMENTS_ROWS,
  DEMO_ATHLETES_MIN_ROWS,
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
} from "@/lib/demoFallbacks";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { formatMoneyEs, formatDate, formatName } from "@/lib/format";
import { paymentLabel } from "@/lib/labels";

export const Route = createFileRoute("/_app/economic/payments")({
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <PaymentsPage />
      </AppLayout>
    </RoleGate>
  ),
});

const PAGE_SIZE = 8;

type PaymentStatus = "Paid" | "Active" | "Failed" | "Pending";

interface DBPayment {
  id: string;
  athlete_id: string | null;
  subscription: string | null;
  section_id: string | null;
  category_id: string | null;
  amount: number;
  status: PaymentStatus;
  payment_date: string | null;
}

function PaymentsPage() {
  const t = useT();
  const { profile } = useAuth();
  const lang = (profile?.language as "es" | "en") ?? "es";
  const orgId = profile?.organization_id;
  const qc = useQueryClient();

  const paymentsQ = useQuery({
    queryKey: ["payments", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(
          "id, athlete_id, subscription, section_id, category_id, amount, status, payment_date",
        )
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBPayment[];
    },
  });
  const athletesQ = useQuery({
    queryKey: ["athletes_min", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("athletes").select("id, first_name, last_name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const sectionsQ = useQuery({
    queryKey: ["sport_sections", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("sport_sections").select("id, name");
      if (error) throw error;
      return data ?? [];
    },
  });
  const categoriesQ = useQuery({
    queryKey: ["categories", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const payments = (paymentsQ.data ?? DEMO_PAYMENTS_ROWS) as DBPayment[];
  const athletes = athletesQ.data ?? DEMO_ATHLETES_MIN_ROWS;
  const sections = sectionsQ.data ?? DEMO_SECTIONS_ROWS;
  const categories = categoriesQ.data ?? DEMO_CATEGORIES_ROWS;

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const { error } = await supabase.from("payments").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["payments", orgId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [secF, setSecF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [quotaF, setQuotaF] = useState("all");
  const [page, setPage] = useState(1);

  const subs = Array.from(
    new Set(payments.map((p) => p.subscription).filter((s): s is string => !!s)),
  );
  const filtered = payments.filter((p) => {
    if (secF !== "all" && p.section_id !== secF) return false;
    if (catF !== "all" && p.category_id !== catF) return false;
    if (statusF !== "all" && p.status !== statusF) return false;
    if (quotaF !== "all" && p.subscription !== quotaF) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = ["Athlete", "Subscription", "Section", "Amount", "Status", "Date"];
    const rows = filtered.map((p) => {
      const a = athletes.find((a) => a.id === p.athlete_id);
      const s = sections.find((s) => s.id === p.section_id);
      return [
        `${a?.first_name ?? ""} ${a?.last_name ?? ""}`,
        p.subscription ?? "",
        s?.name ?? "",
        p.amount,
        p.status,
        p.payment_date ?? "",
      ];
    });
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openInvoice = (id: string) => {
    const p = payments.find((p) => p.id === id);
    if (!p) return;
    const a = athletes.find((a) => a.id === p.athlete_id);
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${p.id}</title>
      <style>body{font-family:Inter,sans-serif;padding:48px;color:#1F2A44}.h{display:flex;justify-content:space-between;border-bottom:2px solid #0074D9;padding-bottom:16px}.t{margin-top:32px;width:100%;border-collapse:collapse}.t td,.t th{padding:8px;text-align:left;border-bottom:1px solid #eee}</style>
      </head><body><div class="h"><h1 style="color:#0074D9;margin:0">SAITO</h1><div>Invoice #${p.id}</div></div>
      <p>Athlete: <b>${a?.first_name ?? ""} ${a?.last_name ?? ""}</b></p>
      <table class="t"><tr><th>Subscription</th><th>Date</th><th>Status</th><th style="text-align:right">Amount</th></tr>
      <tr><td>${p.subscription ?? ""}</td><td>${p.payment_date ?? ""}</td><td>${p.status}</td><td style="text-align:right">€${p.amount}</td></tr></table>
      <p style="margin-top:32px;font-size:12px;color:#6B7894">Demo invoice — not a fiscal document.</p>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <>
      <PageHeader
        title={t("payment_status")}
        actions={
          <Button variant="outline" className="rounded-full" onClick={exportCsv}>
            <Download className="mr-1 h-4 w-4" />
            {t("export_csv")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          value={secF}
          onValueChange={(v) => {
            setSecF(v);
            setPage(1);
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
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 rounded-full">
            <SelectValue placeholder={t("all_categories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_categories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusF}
          onValueChange={(v) => {
            setStatusF(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40 rounded-full">
            <SelectValue placeholder={t("all_statuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_statuses")}</SelectItem>
            {(["Paid", "Active", "Failed", "Pending"] as PaymentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={quotaF}
          onValueChange={(v) => {
            setQuotaF(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48 rounded-full">
            <SelectValue placeholder={t("all_quotas")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_quotas")}</SelectItem>
            {subs.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>{t("no_payments")}</EmptyState>
      ) : (
        <div className="saito-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">{t("athlete")}</th>
                <th className="px-5 py-3 font-semibold">{t("subscription")}</th>
                <th className="px-5 py-3 font-semibold">{t("section")}</th>
                <th className="px-5 py-3 font-semibold">{t("category")}</th>
                <th className="px-5 py-3 font-semibold">{t("amount")}</th>
                <th className="px-5 py-3 font-semibold">{t("status")}</th>
                <th className="px-5 py-3 font-semibold">{t("date")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const a = athletes.find((a) => a.id === p.athlete_id);
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">
                      {a ? formatName(a.first_name, a.last_name) : "—"}
                    </td>
                    <td className="px-5 py-3">{p.subscription ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {sections.find((s) => s.id === p.section_id)?.name}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {categories.find((c) => c.id === p.category_id)?.name}
                    </td>
                    <td className="px-5 py-3 tabular-nums">{formatMoneyEs(Number(p.amount))}</td>
                    <td className="px-5 py-3">
                      <Pill
                        tone={
                          p.status === "Paid"
                            ? "success"
                            : p.status === "Failed"
                              ? "danger"
                              : p.status === "Pending"
                                ? "warning"
                                : "info"
                        }
                      >
                        {paymentLabel(p.status, lang)}
                      </Pill>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">
                      {p.payment_date ? formatDate(p.payment_date) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => openInvoice(p.id)}>
                        {t("view_invoice_pdf")}
                      </Button>
                      {p.status !== "Paid" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-success"
                          onClick={() => setStatus.mutate({ id: p.id, status: "Paid" })}
                        >
                          {t("mark_paid")}
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

      <div className="mt-4 flex items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {t("showing_records")} {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}{" "}
          {t("to_word")} {Math.min(page * PAGE_SIZE, filtered.length)} {t("of_word")}{" "}
          {filtered.length} {t("records")}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            {t("first_page")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t("prev_page")}
          </Button>
          <span className="px-2 tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("next_page")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {t("last_page")}
          </Button>
        </div>
      </div>
    </>
  );
}
