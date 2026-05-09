import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader } from "@/components/ui-kit";
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
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/organizations")({
  component: () => (
    <RoleGate roles={["sysadmin"]}>
      <AppLayout>
        <OrganizationsPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Org = {
  id: string;
  name: string;
  slug: string;
  language: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

const PAGE_SIZE = 8;
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function OrganizationsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Org | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [language, setLanguage] = useState("es");

  const orgsQ = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Org[];
    },
  });

  const addOrg = useMutation({
    mutationFn: async (input: { name: string; slug: string; language: string }) => {
      const { error } = await supabase.from("organizations").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["organizations"] });
      setOpen(false);
      setName(""); setSlug(""); setLanguage("es");
    },
  });

  const updateOrg = useMutation({
    mutationFn: async (input: { id: string; patch: Partial<Org> }) => {
      const { error } = await supabase.from("organizations").update(input.patch).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });

  const delOrg = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organizations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["organizations"] });
      setDetail(null);
    },
  });

  const orgs = orgsQ.data ?? [];
  const totalPages = Math.max(1, Math.ceil(orgs.length / PAGE_SIZE));
  const paged = orgs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Organizations"
        subtitle="Manage all organizations on the SAITO platform."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New organization</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New organization</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  disabled={!name.trim() || !slug.trim() || addOrg.isPending}
                  onClick={() => addOrg.mutate({ name: name.trim(), slug: slug.trim(), language })}
                >Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="saito-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Lang</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {orgsQ.isLoading && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-muted-foreground">…</td></tr>
              )}
              {!orgsQ.isLoading && paged.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-muted-foreground">No organizations</td></tr>
              )}
              {paged.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{o.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.slug}</td>
                  <td className="px-5 py-3 uppercase text-xs">{o.language}</td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(o.created_at)}</td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(o.updated_at)}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => setDetail(o)}>Details</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete this organization?")) delOrg.mutate(o.id); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <button className="text-muted-foreground hover:text-foreground disabled:opacity-40" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`flex h-7 w-7 items-center justify-center rounded-full ${n === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{n}</button>
          ))}
          <button className="text-muted-foreground hover:text-foreground disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {detail && (
            <>
              <SheetHeader><SheetTitle>{detail.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-xs">{detail.id}</span></div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={detail.name}
                    onChange={(e) => setDetail({ ...detail, name: e.target.value })}
                    onBlur={() => updateOrg.mutate({ id: detail.id, patch: { name: detail.name } })}
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={detail.slug}
                    onChange={(e) => setDetail({ ...detail, slug: slugify(e.target.value) })}
                    onBlur={() => updateOrg.mutate({ id: detail.id, patch: { slug: detail.slug } })}
                  />
                </div>
                <div>
                  <Label>Language</Label>
                  <Select
                    value={detail.language}
                    onValueChange={(v) => { setDetail({ ...detail, language: v }); updateOrg.mutate({ id: detail.id, patch: { language: v } }); }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Created: {formatDateTime(detail.created_at)}<br />
                  Updated: {formatDateTime(detail.updated_at)}
                </div>
                <div className="pt-4">
                  <Button variant="destructive" onClick={() => { if (confirm("Delete this organization?")) delOrg.mutate(detail.id); }}>Delete organization</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
