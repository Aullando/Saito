import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal — SAITO" },
      {
        name: "description",
        content: "Información legal y datos identificativos del prestador del servicio SAITO.",
      },
    ],
    links: hrefLangLinks("/aviso-legal", "es"),
  }),
  component: () => (
    <LegalPage
      locale="es"
      eyebrow="Legal"
      title="Aviso legal"
      updated="9 de mayo de 2026"
      sections={[
        {
          title: "1. Datos identificativos",
          body: [
            "En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se facilita la información identificativa del titular del sitio web saito.app (en adelante, “SAITO”).",
            "Los datos fiscales completos del prestador se proporcionan a clientes y usuarios que lo soliciten en hola@saito.app.",
          ],
        },
        {
          title: "2. Objeto",
          body: [
            "El presente aviso regula el uso del sitio web y de la plataforma SAITO, una solución SaaS de gestión para clubes deportivos. El acceso a la web es gratuito; el uso de la plataforma requiere contrato y, en su caso, suscripción.",
          ],
        },
        {
          title: "3. Propiedad intelectual",
          body: [
            "Todos los contenidos (textos, marcas, logotipos, código, interfaz y diseños) son titularidad de SAITO o de sus licenciantes. Queda prohibida su reproducción sin autorización expresa.",
          ],
        },
        {
          title: "4. Responsabilidad",
          body: [
            "SAITO no se hace responsable de los daños derivados del uso indebido del sitio o de la indisponibilidad puntual del servicio por causas ajenas a su control.",
          ],
        },
        {
          title: "5. Legislación aplicable",
          body: [
            "Este aviso se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del prestador, salvo cuando la normativa imperativa disponga otro fuero.",
          ],
        },
      ]}
    />
  ),
});
