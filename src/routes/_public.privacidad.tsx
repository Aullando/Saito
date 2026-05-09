import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { hrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/_public/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — SAITO" },
      {
        name: "description",
        content:
          "Cómo SAITO trata los datos personales de visitantes, clientes y usuarios de la plataforma.",
      },
    ],
    links: hrefLangLinks("/privacidad", "es"),
  }),
  component: () => (
    <LegalPage
      locale="es"
      eyebrow="Legal"
      title="Política de privacidad"
      updated="9 de mayo de 2026"
      sections={[
        {
          title: "1. Responsable del tratamiento",
          body: [
            "El responsable del tratamiento es SAITO, con dirección de contacto hola@saito.app. Los datos fiscales completos están disponibles previa solicitud.",
          ],
        },
        {
          title: "2. Datos que tratamos",
          body: [
            "Tratamos los datos que nos facilitas en formularios de contacto, registro y uso de la plataforma: nombre, email, teléfono, club u organización, rol y comunicaciones intercambiadas.",
            "Cuando actuamos como encargados del tratamiento para nuestros clientes (clubes), tratamos los datos de socios y deportistas únicamente conforme a sus instrucciones.",
          ],
        },
        {
          title: "3. Finalidades y base legal",
          body: [
            "• Atender solicitudes comerciales y demos (interés legítimo y consentimiento).",
            "• Prestar el servicio contratado (ejecución del contrato).",
            "• Cumplimiento de obligaciones legales (fiscales, contables y de seguridad).",
            "• Envío de comunicaciones comerciales si nos das tu consentimiento.",
          ],
        },
        {
          title: "4. Plazos de conservación",
          body: [
            "Conservamos los datos mientras exista relación contractual y, posteriormente, durante los plazos legales aplicables. Los datos de prospectos se eliminan a los 24 meses sin actividad.",
          ],
        },
        {
          title: "5. Destinatarios",
          body: [
            "No vendemos datos. Recurrimos a proveedores tecnológicos (hosting, email, analítica, IA) que actúan como encargados del tratamiento bajo contratos conformes al RGPD. Los proveedores fuera del EEE cuentan con garantías adecuadas (cláusulas contractuales tipo).",
          ],
        },
        {
          title: "6. Derechos",
          body: [
            "Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a hola@saito.app. También puedes presentar reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
          ],
        },
      ]}
    />
  ),
});
