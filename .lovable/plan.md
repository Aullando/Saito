# SAITO BO — Actualización V2 alta fidelidad

Voy a actualizar el proyecto existente (no rehacer) para acercarlo al spec V2. El stack se mantiene (TanStack Start + shadcn + Zustand + localStorage). Los cambios se enfocan en tokens visuales, componentes reutilizables, datos conectados y un chat IA contextual.

## 1. Tokens y estilos globales (`src/styles.css`)
- Reemplazar paleta por los tokens exactos del spec (oklch equivalents):
  `--app-bg #f7f9fc`, `--sidebar-bg #eef3fa`, `--surface #fff`, `--primary #0072ce`, `--medical #f5a524`, success/danger/warning/unknown bg+text, `--shadow-card`, `--radius-card 25px`, `--radius-input 10px`, `--radius-pill 999px`.
- Cargar Inter desde Google Fonts en `__root.tsx` head.
- Tipografía base 14/400, headings 24-28/700.
- Mantener modo dark existente.

## 2. Componentes reutilizables nuevos (`src/components/ui-kit.tsx` ampliado)
- `DataCard` (card blanca radius 25 sombra suave)
- `StatusPill` (variantes paid/active/failed/pending/medical/unknown)
- `FilterSelect` (select 40px)
- `DataTable` (header 46px, filas 57px, paginación + page-size + "Mostrando X a Y de Z")
- `Modal` wrapper (radius 22-25, overlay)
- `EventChip` (azul training, naranja medical)
- Reuso desde routes existentes.

## 3. Datos y store (`src/lib/seed.ts`, `src/lib/store.ts`, `src/lib/types.ts`)
- Bump version a 7 → reseed.
- Añadir a `Facility`: `photoUrl` (Unsplash), `address`, `capacity`, `sports[]`, `nextActivity`.
- Añadir a `Athlete`: `licenseNumber`, `insuranceNumber`, `height`, `weight`, `incidents[]`, `sessionNotes[]`, `medicalPlans[]`.
- 5 sedes con foto + actividades.
- Eventos calendario conectados a `facilityId`.
- Pagos (~113), cuotas, conversaciones (incluye 21 inbox médico) ya existen — mantener y conectar `feeId`/`athleteId`.
- Acción `resetDemo()` en store.

## 4. Pantallas — ajustes funcionales
- **Login** (`src/routes/login.tsx`): card centrada radius 25, logo, campos email/password, "Forgot your password?", botón "Continue", selector demo (5 roles) ya existente — pulir copy.
- **Organizations** (sysadmin): añadir 4 federaciones extra al seed, paginación textual ya está, modal "New organization" con toggle AI.
- **Club & Organization**: añadir bloque Facilities con `FacilityCard` (foto, dirección, capacidad, deportes, próxima actividad). Drawer al click (filtra calendario).
- **Athletes / Ficha**: el sheet ya es rico — añadir campos Nº licencia, seguro, altura/peso editables, incidencias, planes médicos por rol médico, notas de sesión por rol técnico.
- **Calendar**: añadir filtro por sede; modal "Añadir evento" con campos completos (sede/sección/categoría/grupo/tipo). Eventos `EventChip` color por tipo.
- **Medical calendar**: chips naranjas (`--medical`), modal "Añadir cita" 2 pasos.
- **Fees / Payments**: ya están — refinar para usar `DataTable` y `StatusPill`.
- **Communication**: modal "Nueva circular" ya jerárquico — añadir "Atleta concreto" como nivel.
- **Profile**: añadir botón "Reset demo data".

## 5. Chat IA contextual (`src/components/AIChat.tsx`)
- Botón flotante bottom-right "AI".
- Panel lateral (Sheet shadcn).
- Título por rol.
- Chips de sugerencias por rol.
- Respuestas mock que consultan el store: e.g. "qué organizaciones con IA" → filtra `orgs.aiEnabled`; "pagos fallidos" → filtra `payments.status==='Fallida'`; "citas hoy" → filtra appointments hoy.
- Si pregunta fuera de rol → mensaje "fuera de permisos".
- Render markdown básico.
- Montado en `AppLayout`.

## 6. Sidebar / Topbar / Layout
- Sidebar ya 224px, items pill — solo afinar tokens.
- Topbar: notificaciones + avatar + nombre — ya existe.
- Asegurar fondo `--app-bg` en main, `--sidebar-bg` en sidebar.

## Detalles técnicos
- Convertir hex tokens del spec a oklch para CSS variables (Tailwind v4 + `hsl()`/oklch).
- `EventChip` usa `bg-primary/10 text-primary` o `bg-[--medical]/15 text-[--medical]`.
- `StatusPill` mapea: Pagada→success, Activa→primary soft, Fallida→danger, Pendiente→warning, Apto→success, Lesionado→danger, En revisión→warning, Desconocido→unknown.
- Foto de instalaciones: usar URLs Unsplash estables.
- Chat IA: lógica simple keyword-matching contra store; sin LLM real.
- Persistencia: bump `saito-data` v7.

## Fuera de alcance (esta iteración)
- Editor real de altura/peso persistente (mock visual).
- Export CSV real (botón mock que descarga CSV generado client-side — sí lo hago).
- Drawer de facility con calendario embebido completo (drawer simple con info + lista próximos eventos).

¿Procedo?
