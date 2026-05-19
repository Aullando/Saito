const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, role, context, club, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurado");

    const isGff = club === "gff-demo" || lang === "ar";
    const isRgcc = club === "rgcc";

    const roleScope: Record<string, string> = isGff
      ? {
          sysadmin: "لديك وصول كامل إلى الاتحادات والمستخدمين وبيانات النظام.",
          admin: "لديك وصول إلى بيانات الاتحاد: اللاعبون، المدفوعات، التسجيلات، التقويم، الطبي.",
          manager:
            "لديك وصول إلى عمليات الاتحاد: اللاعبون، المعسكرات، المباريات، التقويم. لا تصل إلى البيانات الطبية الحساسة التفصيلية.",
          technical:
            "تصل فقط إلى البيانات الرياضية: اللاعبون، المجموعات، التدريبات، الأداء. لا تصل إلى المعلومات الاقتصادية.",
          medical:
            "تصل فقط إلى البيانات الطبية: المواعيد، الحالة الطبية للاعبين، العلاجات. لا تصل إلى المعلومات الاقتصادية.",
        }
      : {
          sysadmin: "Tienes acceso completo a organizaciones, usuarios y datos del sistema.",
          admin: "Tienes acceso a datos del club: deportistas, pagos, cuotas, calendario, médico.",
          manager:
            "Tienes acceso a operaciones del club: deportistas, pagos, cuotas, calendario. NO accedes a datos sensibles médicos detallados.",
          technical:
            "Solo accedes a datos deportivos: deportistas, grupos, entrenamientos, rendimiento. NO accedes a información económica.",
          medical:
            "Solo accedes a datos médicos: citas, estado médico de deportistas, tratamientos. NO accedes a información económica.",
        };

    const clubIntro = isGff
      ? `أنت المساعد الذكي لاتحاد كرة القدم الخليجي (GFF) داخل منصة SAITO، للدور "${role}". يشمل السياق المنتخبات الوطنية، اللاعبين، الجهاز الفني، المباريات، المعسكرات، التقويم الدولي، والأندية المنتسبة. عند الحاجة استخدم جداول أو قوائم واضحة.`
      : isRgcc
        ? `Eres el copiloto operativo del Real Grupo de Cultura Covadonga (RGCC) dentro de SAITO. El contexto incluye clases, monitores, sedes/salas, incidencias, ausencias/sustituciones, sesiones de entrenamiento personal, biblioteca de ejercicios y socios. Cuando proceda, responde con tablas o listas claras agrupadas por sede/horario.`
        : `Eres el asistente IA del club deportivo Saito para el rol "${role}".`;

    const langInstruction = isGff
      ? `أجب دائمًا باللغة العربية الفصحى، بأسلوب موجز ومهني. استخدم بيانات الاتحاد المُقدَّمة أدناه للإجابة بدقة. إذا كان السؤال خارج صلاحيات هذا الدور، أجب: "هذا الاستعلام خارج صلاحيات دورك." إذا لم تجد بيانات كافية، صرّح بذلك بوضوح. استخدم تنسيق markdown خفيف (قوائم، عريض) عند الفائدة.\n\nبيانات الاتحاد (JSON):`
      : `Responde SIEMPRE en español, de forma concisa y profesional. Usa los datos del club que se te proporcionan a continuación para responder con precisión. Si la pregunta queda fuera de los permisos del rol, responde: "Esta consulta queda fuera de los permisos de tu rol."\n\nSi no encuentras datos suficientes, dilo claramente. Usa formato markdown ligero (listas, negritas) cuando ayude a la lectura.\n\nDATOS DEL CLUB (JSON):`;

    const systemPrompt = `${clubIntro} ${roleScope[role] ?? ""}\n\n${langInstruction}\n${JSON.stringify(context).slice(0, 60000)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
        return new Response(
          JSON.stringify({
            error: "Se han agotado los créditos de IA. Añade saldo en tu workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del gateway IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
