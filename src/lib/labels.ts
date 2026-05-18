import type { Lang, Role, AthleteStatus, MedicalStatus, PaymentStatus, Fee } from "./types";
import { STR } from "./i18n";

export const roleLabel = (role: Role, lang: Lang): string => {
  switch (role) {
    case "admin":
      return STR.recipient_role_admin[lang];
    case "manager":
      return STR.recipient_role_manager[lang];
    case "technical":
      return STR.recipient_role_technical[lang];
    case "medical":
      return STR.recipient_role_medical[lang];
    case "sysadmin":
      return "SysAdmin";
    case "athlete":
      return lang === "en" ? "Athlete" : "Atleta";
  }
};

export const athleteStatusLabel = (s: AthleteStatus, lang: Lang) =>
  ({
    Active: STR.active_st[lang],
    Inactive: STR.inactive_st[lang],
    Pending: STR.pending_st[lang],
  })[s];

export const medicalLabel = (s: MedicalStatus, lang: Lang) =>
  ({
    Fit: STR.fit[lang],
    Injured: STR.injured[lang],
    "Under review": STR.under_review[lang],
    Unknown: STR.unknown[lang],
  })[s];

export const paymentLabel = (s: PaymentStatus, lang: Lang) =>
  ({
    Paid: STR.paid_st[lang],
    Active: STR.active_pay[lang],
    Failed: STR.failed_st[lang],
    Pending: STR.pending_pay[lang],
  })[s];

export const frequencyLabel = (f: Fee["frequency"], lang: Lang) =>
  ({
    Daily: STR.daily[lang],
    Monthly: STR.monthly[lang],
    Quarterly: STR.quarterly[lang],
    Annual: STR.annual[lang],
    "One-time": STR.onetime[lang],
  })[f];
