import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { SectionRow, CategoryRow, GroupRow } from "./data";

export interface NewAthleteDialogProps {
  orgId: string | null;
  sections: SectionRow[];
  categories: CategoryRow[];
  groups: GroupRow[];
}

export function NewAthleteDialog({ orgId, sections, categories, groups }: NewAthleteDialogProps) {
  const t = useT();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newAth, setNewAth] = useState({
    firstName: "",
    lastName: "",
    sectionId: "",
    categoryId: "",
    groupId: "",
  });

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

  return (
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
  );
}
