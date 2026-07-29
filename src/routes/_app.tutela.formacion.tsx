import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { RoleGate } from "@/components/RoleGate";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Check } from "lucide-react";
import { useTr } from "@/lib/i18n";

export const Route = createFileRoute("/_app/tutela/formacion")({
  head: () => ({ meta: [{ title: "Tutela · Formación — SAITO" }] }),
  component: () => (
    <RoleGate roles={["admin", "manager"]}>
      <AppLayout>
        <TutelaFormacionPage />
      </AppLayout>
    </RoleGate>
  ),
});

type Tutela = "aceptada" | "pendiente" | "no_requiere";

const ROWS: {
  id: string;
  name: string;
  birth: string;
  age: number;
  tutela: Tutela;
  active: boolean;
}[] = [
  { id: "1", name: "Bruno CANO", birth: "12/03/2013", age: 13, tutela: "aceptada", active: true },
  { id: "2", name: "Nora ISERN", birth: "04/09/2013", age: 12, tutela: "pendiente", active: false },
  { id: "3", name: "Iker BALDA", birth: "22/01/2010", age: 16, tutela: "no_requiere", active: true },
  { id: "4", name: "Vera MOLINS", birth: "30/06/2012", age: 13, tutela: "aceptada", active: true },
  { id: "5", name: "Teo ARANDA", birth: "15/11/2013", age: 12, tutela: "pendiente", active: false },
];

function RainbowDot({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(from 210deg,#F12F4A,#FDB113,#00A74D,#0067C9,#8A2BE2,#F12F4A)",
        WebkitMask: "radial-gradient(circle, transparent 42%, #000 44%)",
        mask: "radial-gradient(circle, transparent 42%, #000 44%)",
      }}
    />
  );
}

function TutelaBadge({ t, tr }: { t: Tutela; tr: (es: string, en: string, sr?: string) => string }) {
  if (t === "aceptada")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534]">
        <Check className="w-3.5 h-3.5" /> {tr("Tutela aceptada", "Guardianship accepted", "Starateljstvo prihvaćeno")}
      </span>
    );
  if (t === "pendiente")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
        <Clock className="w-3.5 h-3.5" /> {tr("Pendiente de tutor", "Awaiting guardian", "Čeka se staratelj")}
      </span>
    );
  return (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#E4EAF2] text-[#6B7A90]">
      {tr("No requiere tutor", "Guardian not required", "Staratelj nije potreban")}
    </span>
  );
}

function ActiveBadge({ active, tr }: { active: boolean; tr: (es: string, en: string, sr?: string) => string }) {
  return active ? (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-[#166534]">{tr("Activo", "Active", "Aktivan")}</span>
  ) : (
    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-[#8A98AE]">{tr("Pendiente", "Pending", "Na čekanju")}</span>
  );
}

function TutelaFormacionPage() {
  const tr = useTr();
  const aceptadas = 7;
  const pendientes = ROWS.filter((r) => r.tutela === "pendiente").length;
  const noReq = ROWS.filter((r) => r.tutela === "no_requiere").length;

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/athletes"
          className="w-10 h-10 rounded-full bg-white border border-[#E4EAF2] flex items-center justify-center text-[#6B7A90] hover:bg-[#F4F7FB]"
          aria-label={tr("Volver", "Back", "Nazad")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-semibold text-[#0F1B2D]">{tr("Categoría: Formación", "Category: Youth", "Kategorija: Omladinski")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E4EAF2]">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-[#0067C9]">{tr("Grupo Norte", "North Group", "Severna grupa")}</h2>
              <button className="text-[#8A98AE] hover:text-[#0067C9]" aria-label={tr("Editar", "Edit", "Izmeni")}>
                ✎
              </button>
            </div>
            <div className="text-sm text-[#6B7A90]">
              11 {tr("deportistas", "athletes", "sportista")} · 2 {tr("staff técnico", "technical staff", "tehničko osoblje")} · 1 {tr("staff médico", "medical staff", "medicinsko osoblje")}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F7FB] text-sm text-[#0F1B2D]">
              <MapPin className="w-4 h-4 text-[#6B7A90]" /> {tr("Pabellón Central", "Central Hall", "Centralna dvorana")}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F7FB] text-sm text-[#0F1B2D]">
              <Clock className="w-4 h-4 text-[#6B7A90]" /> {tr("Lun · Mar · Mié · Jue · Vie", "Mon · Tue · Wed · Thu · Fri", "Pon · Uto · Sre · Čet · Pet")}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 text-xs text-[#8A98AE] pb-3 border-b border-[#EEF1F6]">
            <div>{tr("Deportista", "Athlete", "Sportista")}</div>
            <div>{tr("Nacimiento", "Birth", "Rođenje")}</div>
            <div>{tr("Edad", "Age", "Starost")}</div>
            <div>{tr("Tutela", "Guardianship", "Starateljstvo")}</div>
            <div>{tr("Estado", "Status", "Status")}</div>
          </div>

          <ul className="divide-y divide-[#EEF1F6]">
            {ROWS.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[1fr_1fr_80px_1fr_100px] gap-4 items-center py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <RainbowDot size={28} />
                  <span className="font-semibold text-[#0F1B2D] truncate">{r.name}</span>
                </div>
                <div className="text-[#0F1B2D]">{r.birth}</div>
                <div className="text-[#0F1B2D]">{r.age}</div>
                <div>
                  <TutelaBadge t={r.tutela} tr={tr} />
                </div>
                <div>
                  <ActiveBadge active={r.active} tr={tr} />
                </div>
              </li>
            ))}
          </ul>

          <div
            className="mt-8 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm bg-[#EEF3FB] text-[#0F1B2D]"
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#0067C9]" />
            <span>
              {tr(
                "El umbral de consentimiento se aplica automáticamente por país. En España, 14 años. Un club puede exigir más edad, nunca menos.",
                "The consent threshold is applied automatically by country. In Spain, 14 years. A club may require a higher age, never lower.",
                "Prag saglasnosti se automatski primenjuje po zemlji. U Španiji, 14 godina. Klub može zahtevati viši uzrast, nikada niži.",
              )}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4EAF2] self-start">
          <h3 className="text-lg font-semibold text-[#0F1B2D] mb-6">{tr("Estado de tutela", "Guardianship status", "Status starateljstva")}</h3>

          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F6] pb-4">
              <span className="text-[#6B7A90]">{tr("Aceptadas", "Accepted", "Prihvaćeno")}</span>
              <span className="text-2xl font-semibold text-[#16A34A]">{aceptadas}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EEF1F6] pb-4">
              <span className="text-[#6B7A90]">{tr("Pendientes de tutor", "Awaiting guardian", "Čeka se staratelj")}</span>
              <span className="text-2xl font-semibold text-[#D97706]">{pendientes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7A90]">{tr("No requieren tutor", "Guardian not required", "Staratelj nije potreban")}</span>
              <span className="text-2xl font-semibold text-[#0F1B2D]">{noReq}</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl px-4 py-3 text-sm bg-[#FEF3C7] text-[#7C4A03]">
            {tr(
              "Si un tutor rechaza la tutela, el administrador recibe un aviso y queda registrado en el historial de actividad.",
              "If a guardian rejects the guardianship, the administrator is notified and it is recorded in the activity log.",
              "Ako staratelj odbije starateljstvo, administrator dobija obaveštenje i to se beleži u istoriji aktivnosti.",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
