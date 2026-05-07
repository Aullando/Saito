import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { PageHeader, Pill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/lib/store";
import type { Organization } from "@/lib/types";
import { Plus } from "lucide-react";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/organizations")({
  component: () => (
    <RoleGate roles={["sysadmin"]}>
      <AppLayout>
        <OrganizationsPage />
      </AppLayout>
    </RoleGate>
  ),
});

const PAGE_SIZE = 6;

function OrganizationsPage() {
  const orgs = useData((s) => s.organizations);
  const addOrganization = useData((s) => s.addOrganization);
  const toggleOrgAi = useData((s) => s.toggleOrgAi);
  const setOrgStatus = useData((s) => s.setOrgStatus);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Organization | null>(null);
  const [name, setName] = useState("");

  const filtered = orgs.filter((o) => statusFilter === "all" || o.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Organizations"
        subtitle="Manage all organizations on the SAITO platform."
        actions={
          <>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44 rounded-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New organization</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New organization</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (!name.trim()) return;
                      addOrganization({ name, status: "Active", aiEnabled: false });
                      setName("");
                      setOpen(false);
                    }}
                  >Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="saito-card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Created</th>
              <th className="px-5 py-3 font-semibold">Updated</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">AI</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-5 py-3 font-medium">{o.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{formatDateTime(o.createdAt)}</td>
                <td className="px-5 py-3 text-muted-foreground">{formatDateTime(o.updatedAt)}</td>
                <td className="px-5 py-3">
                  <Pill tone={o.status === "Active" ? "success" : "default"}>{o.status}</Pill>
                </td>
                <td className="px-5 py-3 text-sm font-medium">{o.aiEnabled ? "Yes" : "No"}</td>
                <td className="px-5 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setDetail(o)}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 text-sm">
        <button className="text-muted-foreground hover:text-foreground disabled:opacity-40" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous Page</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setPage(n)} className={`flex h-7 w-7 items-center justify-center rounded-full ${n === page ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{n}</button>
        ))}
        <button className="text-muted-foreground hover:text-foreground disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next Page</button>
      </div>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {detail && (
            <>
              <SheetHeader><SheetTitle>{detail.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> {detail.id}</div>
                <div><span className="text-muted-foreground">Created:</span> {detail.createdAt}</div>
                <div><span className="text-muted-foreground">Updated:</span> {detail.updatedAt}</div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Pill tone={detail.status === "Active" ? "success" : "default"}>{detail.status}</Pill>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">AI enabled:</span>
                  <Switch checked={detail.aiEnabled} onCheckedChange={() => { toggleOrgAi(detail.id); setDetail({ ...detail, aiEnabled: !detail.aiEnabled }); }} />
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const ns = detail.status === "Active" ? "Inactive" : "Active";
                      setOrgStatus(detail.id, ns);
                      setDetail({ ...detail, status: ns });
                    }}
                  >Toggle status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
