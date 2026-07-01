import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_ATHLETES_ROWS,
  DEMO_SECTIONS_ROWS,
  DEMO_CATEGORIES_ROWS,
  DEMO_GROUPS_ROWS,
  DEMO_ATHLETE_GROUPS_ROWS,
} from "@/lib/demoFallbacks";
import { demoOrEmpty } from "@/lib/demoFallback";

export type AthleteRow = {
  id: string;
  first_name: string;
  last_name: string;
  section_id: string | null;
  category_id: string | null;
  status: string;
  medical_status: string;
  performance_status: string;
};
export type SectionRow = { id: string; name: string };
export type CategoryRow = { id: string; name: string; section_id: string };
export type GroupRow = { id: string; name: string; section_id: string; category_id: string };
export type AthleteGroupRow = { athlete_id: string; group_id: string };

export function useAthletesData(orgId: string | null) {
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

  return {
    athletes: demoOrEmpty(athletesQ.data, DEMO_ATHLETES_ROWS) as AthleteRow[],
    sections: demoOrEmpty(sectionsQ.data, DEMO_SECTIONS_ROWS) as SectionRow[],
    categories: demoOrEmpty(categoriesQ.data, DEMO_CATEGORIES_ROWS) as CategoryRow[],
    groups: demoOrEmpty(groupsQ.data, DEMO_GROUPS_ROWS) as GroupRow[],
    athleteGroups: demoOrEmpty(athleteGroupsQ.data, DEMO_ATHLETE_GROUPS_ROWS) as AthleteGroupRow[],
    isLoading: athletesQ.isLoading || sectionsQ.isLoading,
  };
}
