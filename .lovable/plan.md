# IA con acciones en SAITO

Convertir el chat de IA actual (solo lectura) en un asistente capaz de **ejecutar acciones** sobre el store local Zustand, respetando rol del usuario y MVP scope.

## Arquitectura

```text
┌─────────────┐   prompt+tools+context   ┌──────────────┐
│  AIChat.tsx │ ───────────────────────► │  ai-chat     │
│  (cliente)  │                          │  (edge fn)   │
│             │ ◄─── stream (text +      │  AI SDK +    │
│             │      tool-call JSON)     │  Lovable AI  │
└─────┬───────┘                          └──────────────┘
      │ parse tool-calls
      ▼
┌─────────────────────┐
│ executeAction()     │  ──► useData store (Zustand)
│ - valida rol        │  ──► toast feedback
│ - confirm si destr. │
└─────────────────────┘
```

Cliente Zustand sigue siendo la "fuente de verdad" demo. La IA propone acciones; el cliente decide si las aplica.

## Catálogo inicial (12 acciones)

| # | Acción | Roles permitidos | Destructiva |
|---|---|---|---|
| 1 | `markFeeAsPaid(feeId)` | admin, manager | no |
| 2 | `markFeeAsFailed(feeId, reason)` | admin | sí |
| 3 | `createIncident(type, sectionId, description)` | admin, manager, technical | no |
| 4 | `resolveIncident(incidentId)` | admin, manager | no |
| 5 | `createMedicalRestriction(athleteId, days, operationalNote)` | medical | sí |
| 6 | `clearMedicalRestriction(athleteId)` | medical | sí |
| 7 | `moveSession(sessionId, newDate, newLane?)` | technical, manager | no |
| 8 | `cancelSession(sessionId, reason)` | technical, manager | sí |
| 9 | `enrollAthleteInEvent(athleteId, eventId)` | admin, technical, manager | no |
| 10 | `unenrollAthleteFromEvent(athleteId, eventId)` | admin, technical | no |
| 11 | `sendNotification(audience, message)` | admin, manager, technical | sí |
| 12 | `scheduleMedicalAppointment(athleteId, dateISO, kind)` | medical, admin | no |

Extensible: 2-3 más por club (CNSO carriles, RGCC sustitución de monitor) en siguiente iteración.

## Detalles técnicos

### 1. Protocolo de tool-calls

El modelo se instruye para emitir, dentro del stream normal, bloques JSON delimitados:

````text
Voy a marcar la cuota como pagada.

```action
{"tool":"markFeeAsPaid","args":{"feeId":"fee-12"}}
```
````

Razón: el endpoint `ai-chat` actual usa fetch directo a Lovable AI Gateway sin AI SDK. Migrarlo a AI SDK `streamText` + tools server-side añade complejidad y no aporta — `execute` no puede tocar Zustand del cliente. El protocolo embebido es más simple y stack-agnóstico.

### 2. Nuevos archivos

- `src/ai/actions/registry.ts` — definición tipada de cada acción: `{ name, roles, destructive, schema (Zod), apply(args, store, ctx) }`.
- `src/ai/actions/executor.ts` — `parseActionsFromStream(text)`, `executeAction(action, role, club)`: valida rol, lanza confirm modal si destructiva, llama `apply`, devuelve resultado.
- `src/ai/actions/prompt.ts` — genera la sección de "Herramientas disponibles" para el system prompt según rol/club.
- `src/components/ActionConfirmDialog.tsx` — modal shadcn que muestra "¿Confirmar: dar de baja 5 días a Lucía?".

### 3. Cambios en archivos existentes

- `supabase/functions/ai-chat/index.ts`: incluir en el system prompt el bloque de herramientas y las reglas de emisión (formato ```action JSON, no inventar IDs, pedir aclaración si falta info).
- `src/components/AIChat.tsx`:
  - Tras cada chunk, intentar extraer bloques `action` completos.
  - Por cada acción detectada: si destructiva → abrir `ActionConfirmDialog`; ejecutar y añadir mensaje de sistema "✅ Hecho" o "❌ Error".
  - Pasar al edge function la lista de tools permitidas (`allowedTools: string[]`) según rol/club.
- `src/lib/store.ts`: añadir métodos faltantes si alguno no existe (`updateFee`, `addNotification`, etc.).

### 4. Validación por rol

Cada acción declara sus roles. `executeAction` rechaza si `currentRole` no está incluido → la IA recibe en el siguiente turno un mensaje del sistema "Acción rechazada: rol no autorizado", lo que el modelo aprende a evitar.

### 5. Confirmación

`destructive: true` → modal con título de la acción, parámetros legibles y botones Confirmar/Cancelar. No bloquea el stream — la acción se encola y se procesa al cierre del stream.

### 6. Feedback en chat

Después de cada ejecución se inyecta un mensaje role=`assistant` (gris, estilo "system") con el resultado: "✅ Cuota marcada como pagada (Juan Granados, 45€)". Permite que el siguiente turno tenga contexto.

### 7. Respeto MVP scope

Excluidas explícitamente del registry: altas médicas/RTP automáticos, recurrencias, billing real, mutaciones de WFC. Cualquier intento de la IA → rechazo + nota al usuario.

## Fuera de alcance (siguiente iteración)

- Persistencia en Supabase (la demo seguirá perdiendo cambios al recargar).
- Tool calling nativo de AI SDK (requeriría reescribir todo el endpoint).
- Acciones multi-paso encadenadas con aprobación intermedia.
- Undo / historial de acciones IA.

## Validación

1. "Marca la cuota pendiente de Juan como pagada" → ejecuta sin confirm, toast verde, KPI de pagos se actualiza.
2. "Da de baja 5 días a Lucía" (rol medical) → abre confirm, al aceptar añade restricción visible en módulo incidencias.
3. Mismo prompt como rol entrenador → modelo responde "no tienes permisos" sin emitir acción.
4. "Borra todos los pagos" → confirm individual por cada cuota (o rechazo si supera batch).
