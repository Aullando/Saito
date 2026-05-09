import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies — SAITO" },
      {
        name: "description",
        content: "Información sobre las cookies que utiliza el sitio SAITO y cómo gestionarlas.",
      },
    ],
    links: hrefLangLinks("/cookies", "es"),
  }),
  component: () => (
    <LegalPage
      locale="es"
      eyebrow="Legal"
      title="Política de cookies"
      updated="9 de mayo de 2026"
      sections={[
        {
          title: "1. ¿Qué son las cookies?",
          body: [
            "Las cookies son pequeños archivos que un sitio web almacena en tu navegador para recordar información sobre tu visita, mejorar la experiencia o medir el uso del sitio.",
          ],
        },
        {
          title: "2. Cookies utilizadas",
          body: [
            "• Técnicas: necesarias para el funcionamiento del sitio (sesión, idioma, preferencia de tema). No requieren consentimiento.",
            "• Analíticas: nos ayudan a entender el uso agregado del sitio. Solo se activan con tu consentimiento.",
            "• De terceros: si en el futuro integramos vídeos, mapas o píxeles publicitarios, se informará y solicitará consentimiento previo.",
          ],
        },
        {
          title: "3. Gestión y revocación",
          body: [
            "Puedes aceptar, rechazar o configurar cookies desde el banner de consentimiento. También puedes eliminarlas en cualquier momento desde la configuración de tu navegador.",
          ],
        },
        {
          title: "4. Más información",
          body: [
            "Para cualquier consulta relativa a cookies y privacidad, escribe a hola@saito.app.",
          ],
        },
      ]}
    />
  ),
});
