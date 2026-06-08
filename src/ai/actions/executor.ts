// Parses ```action JSON blocks from streamed assistant text and executes them
// against the local store, respecting role and destructive flag.

import { ACTION_REGISTRY, type ActionResult } from "./registry";
import type { Role } from "@/lib/types";

export interface ParsedAction {
  tool: string;
  args: Record<string, unknown>;
  raw: string;
}

const ACTION_BLOCK_RE = /```action\s*\n([\s\S]*?)\n```/g;

export function parseActions(text: string): ParsedAction[] {
  const out: ParsedAction[] = [];
  for (const m of text.matchAll(ACTION_BLOCK_RE)) {
    try {
      const json = JSON.parse(m[1].trim());
      if (json && typeof json.tool === "string") {
        out.push({ tool: json.tool, args: json.args ?? {}, raw: m[0] });
      }
    } catch {
      /* ignore malformed block */
    }
  }
  return out;
}

/** Removes raw action blocks from rendered assistant text. */
export function stripActionBlocks(text: string): string {
  return text.replace(ACTION_BLOCK_RE, "").replace(/\n{3,}/g, "\n\n").trim();
}

export function canExecute(action: ParsedAction, role: Role): {
  ok: boolean;
  def?: ReturnType<typeof getDef>;
  error?: string;
} {
  const def = getDef(action.tool);
  if (!def) return { ok: false, error: `Acción desconocida: ${action.tool}` };
  if (!def.roles.includes(role))
    return { ok: false, error: `Tu rol (${role}) no puede ejecutar ${action.tool}.` };
  return { ok: true, def };
}

export function executeAction(action: ParsedAction): ActionResult {
  const def = getDef(action.tool);
  if (!def) return { ok: false, error: `Acción desconocida: ${action.tool}` };
  try {
    return def.apply(action.args);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error desconocido" };
  }
}

function getDef(name: string) {
  return ACTION_REGISTRY[name];
}
