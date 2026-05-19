import type { ClubModulesConfig, ClubNavItem } from "../types";

export const gffModules: ClubModulesConfig = {
  enabled: [
    "dashboard",
    "gff-national-teams",
    "gff-calendar",
    "gff-clubs",
    "gff-development",
    "gff-reporting",
    "gff-administration",
  ],
};

// Sidebar labels en inglés — el sidebar global de SAITO sigue LTR.
export const gffNavItems: ClubNavItem[] = [
  { module: "dashboard", label: "Dashboard", icon: "Shield", to: "/dashboard" },
  {
    module: "gff-national-teams",
    label: "National teams",
    icon: "Trophy",
    to: "/gff/$slug",
    slug: "national-teams",
  },
  {
    module: "gff-calendar",
    label: "International calendar",
    icon: "CalendarDays",
    to: "/gff/$slug",
    slug: "calendar",
  },
  {
    module: "gff-clubs",
    label: "Affiliated clubs",
    icon: "Building2",
    to: "/gff/$slug",
    slug: "clubs",
  },
  {
    module: "gff-development",
    label: "Development",
    icon: "GraduationCap",
    to: "/gff/$slug",
    slug: "development",
  },
  {
    module: "gff-reporting",
    label: "Reporting",
    icon: "BarChart3",
    to: "/gff/$slug",
    slug: "reporting",
  },
  {
    module: "gff-administration",
    label: "Administration",
    icon: "Settings",
    to: "/gff/$slug",
    slug: "administration",
  },
];
