// Entrada directa a la demo SAITO: al llegar a /login se fija el usuario
// gestor y se navega al dashboard. El PasswordGate ya restringe el acceso.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth as useLocalAuth } from "@/lib/store";
import { useActiveClubStore } from "@/clubs/activeClub";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "SAITO" }] }),
  component: LoginRedirect,
});

function LoginRedirect() {
  const navigate = useNavigate();
  const setUser = useLocalAuth((s) => s.setUser);
  const switchClub = useActiveClubStore((s) => s.switchClub);

  useEffect(() => {
    switchClub("saito");
    setUser("u-mgr");
    navigate({ to: "/dashboard", replace: true });
  }, [navigate, setUser, switchClub]);

  return null;
}
