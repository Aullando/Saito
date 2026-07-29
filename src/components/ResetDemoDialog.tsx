import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth, useData } from "@/lib/store";
import { useCommLocal } from "@/lib/commLocal";

type Lang = "es" | "en" | "sr";

const COPY: Record<Lang, {
  title: string; desc: string; cancel: string; confirm: string; toast: string;
}> = {
  es: {
    title: "¿Reiniciar la demo?",
    desc: "Se perderán todos los cambios de esta sesión y volverán los datos originales de la demo.",
    cancel: "Cancelar",
    confirm: "Reiniciar demo",
    toast: "Demo reiniciada · datos originales restaurados",
  },
  en: {
    title: "Reset the demo?",
    desc: "All changes made in this session will be lost and the original demo data will be restored.",
    cancel: "Cancel",
    confirm: "Reset demo",
    toast: "Demo reset · original data restored",
  },
  sr: {
    title: "Resetovati demo?",
    desc: "Sve promene napravljene u ovoj sesiji biće izgubljene i vratiće se originalni podaci demoa.",
    cancel: "Otkaži",
    confirm: "Resetuj demo",
    toast: "Demo resetovan · originalni podaci vraćeni",
  },
};

export function performResetDemo() {
  const lang = useAuth.getState().langOverride;
  try {
    useData.getState().reset();
  } catch { /* ignore */ }
  try {
    void useCommLocal.persist.clearStorage();
  } catch { /* ignore */ }
  try {
    useAuth.setState({
      currentUserId: null,
      avatars: {},
      mobileNavOpen: false,
      sidebarCollapsed: false,
      langOverride: lang,
    });
  } catch { /* ignore */ }
  try {
    const s = COPY[(lang ?? "es") as Lang].toast;
    toast.success(s);
  } catch { /* ignore */ }
  // Pequeño delay para que se vea el toast antes de recargar.
  setTimeout(() => {
    try { window.location.reload(); } catch { /* ignore */ }
  }, 350);
}

export function ResetDemoDialog({ trigger }: { trigger: ReactNode }) {
  const lang = (useAuth((s) => s.langOverride) ?? "es") as Lang;
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{c.title}</AlertDialogTitle>
          <AlertDialogDescription>{c.desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{c.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              performResetDemo();
            }}
          >
            {c.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
