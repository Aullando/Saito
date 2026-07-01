import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { SectionRow, CategoryRow, GroupRow } from "./data";

export interface AthletesFiltersProps {
  q: string;
  onQ: (v: string) => void;
  statusF: string;
  onStatus: (v: string) => void;
  secF: string;
  onSec: (v: string) => void;
  catF: string;
  onCat: (v: string) => void;
  grpF: string;
  onGrp: (v: string) => void;
  medF: string;
  onMed: (v: string) => void;
  sections: SectionRow[];
  categories: CategoryRow[];
  groups: GroupRow[];
  isMedical: boolean;
}

export function AthletesFilters({
  q,
  onQ,
  statusF,
  onStatus,
  secF,
  onSec,
  catF,
  onCat,
  grpF,
  onGrp,
  medF,
  onMed,
  sections,
  categories,
  groups,
  isMedical,
}: AthletesFiltersProps) {
  const t = useT();
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder={t("search")}
          className="w-56 rounded-full pl-9"
        />
      </div>
      {!isMedical && (
        <Select value={statusF} onValueChange={onStatus}>
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
          onSec(v);
          onCat("all");
          onGrp("all");
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
          onCat(v);
          onGrp("all");
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
        <Select value={grpF} onValueChange={onGrp}>
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
      <Select value={medF} onValueChange={onMed}>
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
  );
}
