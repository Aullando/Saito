const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KNOWLEDGE = `
SAITO — Plataforma SaaS para clubes deportivos.

QUÉ ES SAITO
SAITO es una plataforma todo-en-uno para gestionar clubes deportivos: socios, calendario, pagos, comunicación, salud deportiva, instalaciones e IA por rol. Pensada para clubes de cualquier tamaño y para entidades multi-sección (un mismo club con varias disciplinas).

MÓDULOS PRINCIPALES
- Club e instalaciones: secciones deportivas, categorías, grupos, sedes y salas.
- Deportistas y familias: ficha, autorizaciones, datos de contacto, datos de menores.
- Calendario: entrenamientos, partidos, eventos del club y del cuerpo médico.
- Económico: cuotas, pagos, recibos, impagos, exportaciones.
- Comunicación: mensajes y comunicados a familias, equipos y staff.
- Salud deportiva: citas médicas, parte de lesiones, seguimiento (acceso restringido).
- IA por rol (SAITO AI): asistente que responde sobre los datos del club según permisos.
- Multi-club: una misma cuenta para gestionar varios clubes o secciones.

ROLES Y PERMISOS
SysAdmin, Admin, Manager, Técnico, Médico. Cada rol ve solo lo que necesita. La IA respeta esos permisos.

PRIVACIDAD Y SEGURIDAD
- Aislamiento de datos por club.
- Control de acceso por rol con registro de accesos sensibles.
- Datos alojados en infraestructura cloud en la UE.
- IA privada por diseño: no se entrenan modelos con los datos del club.
- Diseñado para alinearse con RGPD y buenas prácticas de seguridad. Hoja de ruta de certificación para despliegues institucionales. No afirmamos disponer de ISO 27001, ENS ni SOC 2 hoy.
- Tratamiento especial de menores y de datos de salud.

PRECIOS
SAITO se ofrece bajo suscripción con planes según tamaño del club y módulos. Para precios concretos, derivar siempre al formulario de contacto en /contacto.

QUÉ NO ES SAITO
- No es un producto sanitario. No diagnostica.
- No sustituye al cuerpo médico ni al cuerpo técnico.
- No vende datos ni los usa para entrenar modelos de terceros.

ESTILO DE RESPUESTA
- Tono profesional, claro, breve.
- Si la pregunta es comercial concreta (precio, demo, contrato, integración a medida), invitar amablemente a /contacto.
- Si la pregunta es sobre privacidad, remitir a /seguridad cuando ayude.
- Si la pregunta no tiene que ver con SAITO, responder con cortesía que solo puedes ayudar con dudas sobre la plataforma.
- Nunca prometer certificaciones que no estén obtenidas.
- Nunca inventar funcionalidades. Si no sabes, dilo y deriva a /contacto.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, locale } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurado");

    const lang = locale === "en" ? "en" : "es";
    const systemPrompt = `Eres SAITO Assistant, el asistente comercial del sitio web público de SAITO. Tu objetivo es ayudar a clubes deportivos a entender qué es SAITO, qué módulos ofrece, cómo gestiona la privacidad y cómo contratar una demo.

Responde ${lang === "en" ? "SIEMPRE en inglés" : "SIEMPRE en español"}, de forma concisa y profesional. Usa markdown ligero (listas, negritas) cuando ayude.

Reglas:
- No inventes funcionalidades.
- No prometas certificaciones que SAITO no tenga (ISO 27001, ENS, SOC 2 no están obtenidas hoy).
- No des precios concretos: invita a /contacto para una propuesta.
- Para temas de privacidad y seguridad, sugiere /seguridad cuando aporte.
- Si la pregunta no es sobre SAITO, responde cortésmente que solo puedes ayudar con dudas sobre la plataforma.
- Cierra ofreciendo Solicitar demo (/contacto) cuando tenga sentido.

INFORMACIÓN DE PRODUCTO:
${KNOWLEDGE}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de peticiones alcanzado, intenta en un momento." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Se han agotado los créditos de IA." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("commercial-chat gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del gateway IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("commercial-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
