// Builds the "available tools" section appended to the AI system prompt.
// Lists only actions the current role can call, and instructs the model on
// the exact emission format the client parses.

import { actionsForRole } from "./registry";
import type { Role } from "@/lib/types";

export function buildToolsPrompt(role: Role, lang: "es" | "en" | "ar"): string {
  const available = actionsForRole(role);
  if (available.length === 0) return "";

  const lines = available.map(
    (a) =>
      `- ${a.name}(${a.params}) — ${a.description}${a.destructive ? " [requiere confirmación]" : ""}`,
  );

  if (lang === "ar") {
    return [
      "\n\nالأدوات المتاحة لهذا الدور:",
      ...lines,
      "\nلتنفيذ إجراء، أدرج في ردك كتلة JSON بهذا الشكل بالضبط:",
      "```action",
      '{"tool":"<name>","args":{...}}',
      "```",
      "قواعد صارمة:",
      "- استخدم فقط المعرفات (IDs) الحقيقية من بيانات السياق. لا تخترع IDs.",
      "- إذا كان المستخدم يطلب إجراءً غير متاح لدوره، ارفض بأدب ولا تصدر أي كتلة action.",
      "- إذا كانت معلومة ناقصة (مثل ID)، اسأل المستخدم قبل إصدار الإجراء.",
      "- يمكنك إصدار عدة كتل action في الرد نفسه إذا طلب المستخدم ذلك صراحة.",
    ].join("\n");
  }

  if (lang === "en") {
    return [
      "\n\nACTIONS AVAILABLE FOR THIS ROLE:",
      ...lines,
      "\nTo execute an action, include in your reply a JSON block in this exact format:",
      "```action",
      '{"tool":"<name>","args":{...}}',
      "```",
      "Strict rules:",
      "- Use ONLY real IDs from the provided context data. Never invent IDs.",
      "- If the user asks for an action not available for their role, politely refuse and emit NO action block.",
      "- If required info is missing (e.g. an ID), ask the user before emitting the action.",
      "- You may emit multiple action blocks in the same reply only if the user explicitly asked for a batch.",
      "- Always write a short natural-language explanation BEFORE the action block(s).",
    ].join("\n");
  }

  return [
    "\n\nACCIONES DISPONIBLES PARA ESTE ROL:",
    ...lines,
    "\nPara ejecutar una acción incluye en tu respuesta un bloque JSON con este formato EXACTO:",
    "```action",
    '{"tool":"<nombre>","args":{...}}',
    "```",
    "Reglas estrictas:",
    "- Usa SOLO IDs reales presentes en los datos de contexto. NUNCA inventes IDs.",
    "- Si el usuario pide una acción no disponible para su rol, rechaza educadamente y NO emitas bloque action.",
    "- Si falta información (por ejemplo un ID), pregunta al usuario antes de emitir la acción.",
    "- Puedes emitir varios bloques action en la misma respuesta sólo si el usuario pidió un lote.",
    "- Escribe siempre una breve explicación en lenguaje natural ANTES de los bloques action.",
  ].join("\n");
}
