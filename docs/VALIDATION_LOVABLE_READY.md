# Validación final — Lovable Ready

**Fecha de validación:** 2026-05-09
**Branch / entorno:** sandbox Lovable, Node 20, npm 10

---

## 1. Comandos ejecutados

| # | Comando | Resultado | Notas |
|---|---|---|---|
| 1 | `npm ci` | ✅ OK | 646 paquetes en ~13s, sin fallar |
| 2 | `npm run lint` | ⚠️ 0 errors / 11 warnings | Pasaba con 755 errores de Prettier; corregidos con `npx prettier --write` |
| 3 | `npx tsc --noEmit` (typecheck) | ✅ OK | Sin script `typecheck` en `package.json`; ejecutado directamente |
| 4 | `npm test` | ✅ 28/28 pasan | 5 archivos, Vitest 4.1.5, 1.85s |
| 5 | `npm run build` | ✅ OK | Build TanStack Start + worker, 10.97s |
| 6 | `npx playwright test --list` | ✅ 9 tests listados | 2 archivos (`auth-redirect`, `rgcc-navigation`); ejecución real requiere `npx playwright install chromium` |
| 7 | `npm audit --audit-level=moderate` | ⚠️ No disponible en sandbox | El registry interno responde `operation is not supported`. Como sustituto se usó el escáner interno: **0 vulnerabilidades high/critical**. |

### Detalles de los warnings de lint (no bloquean)

- `src/lib/auth.tsx:68` — `react-refresh/only-export-components`. Mezcla provider + hook; cosmético.
- `src/routes/_app.economic.fees.tsx:91` — `react-hooks/exhaustive-deps` sobre `sections`. Falso positivo de `useEffect`.

---

## 2. Comprobaciones manuales

| # | Comprobación | Estado |
|---|---|---|
| 1 | No existe `.env` real versionado | ✅ `.env` está en `.gitignore` (entradas añadidas en este pase) |
| 2 | Existe `.env.example` | ✅ Sí, con documentación completa |
| 3 | No existe `bun.lock` | ✅ Eliminado |
| 4 | Playwright no usa bun | ✅ `playwright.config.ts` usa `npm run dev` |
| 5 | No hay contraseña hardcodeada | ⚠️ `PasswordGate.tsx` tiene fallback literal `"hola"` cuando `VITE_DEMO_PASSWORD` no está definida. **Es un fallback de demo**, no protege nada real, y solo se activa con `VITE_ENABLE_PASSWORD_GATE=true`. Recomendado quitarlo o cambiarlo antes de un despliegue privado serio. |
| 6 | Separación entre `VITE_DEMO_MODE=true/false` | ✅ Helpers en `src/lib/appMode.ts` |
| 7 | Datos demo no aparecen como fallback en producción | ✅ `src/lib/demoFallback.ts` (`demoOr`, `demoOrEmpty`) y refactor de 7 rutas privadas. **Pendientes:** `_app.attendance.tsx`, `_app.medical.restrictions.tsx`, `_app.economic.fees.tsx` y rutas `_app.rgcc.*` usan seed como única fuente de datos (no como fallback) — aceptable mientras esos módulos sean exclusivamente demo. |
| 8 | Badge visual demo/real | ✅ `src/components/DataSourceBadge.tsx` montado en `AppLayout`, controlado por `VITE_SHOW_DATA_SOURCE_BADGE` |
| 9 | README explica instalación, variables y Lovable | ✅ `README.md` (creado) cubre instalación con npm, scripts, reglas de seguridad de variables, configuraciones recomendadas, modo demo vs producción, PasswordGate y publish |

---

## 3. Cambios principales aplicados (acumulado)

- **Package manager:** migración total a npm. `package.json` declara `"packageManager": "npm@10"`. Eliminado `bun.lock`. `playwright.config.ts` usa `npm run dev`.
- **Lint:** corrección masiva con Prettier + ESLint `--fix`. 0 errores, 11 warnings cosméticos.
- **Variables de entorno:**
  - `.env`, `.env.local`, `.env.production`, `.env.*.local` añadidos a `.gitignore` (con excepción de `.env.example`).
  - `.env.example` creado con documentación de cada variable y avisos de seguridad sobre `VITE_*`.
- **Modo demo:**
  - `src/lib/appMode.ts` — `isDemoMode`, `isProductionMode`, `showDataSourceBadge`, `getDataSourceLabel`.
  - `src/lib/demoFallback.ts` — `demoOr`, `demoOrEmpty` y constantes de "estado vacío" para producción.
  - 7 rutas privadas refactorizadas para no servir seed como fallback en producción.
- **DataSourceBadge:** componente reutilizable (`fixed` / `inline`) con i18n es/en, montado en `AppLayout`.
- **PasswordGate:** desactivable con `VITE_ENABLE_PASSWORD_GATE=false`; contraseña vía `VITE_DEMO_PASSWORD`. No bloquea preview ni e2e.
- **README.md** creado.

---

## 4. Configuración recomendada para Lovable

### Preview comercial (público, sin contraseña)

```env
VITE_DEMO_MODE=true
VITE_SHOW_DATA_SOURCE_BADGE=true
VITE_ENABLE_PASSWORD_GATE=false
```

### Demo privada (con gate por contraseña)

```env
VITE_DEMO_MODE=true
VITE_SHOW_DATA_SOURCE_BADGE=true
VITE_ENABLE_PASSWORD_GATE=true
VITE_DEMO_PASSWORD=change-me
```

### Producción real

```env
VITE_DEMO_MODE=false
VITE_SHOW_DATA_SOURCE_BADGE=false
VITE_ENABLE_PASSWORD_GATE=false
# Claves Supabase reales (anon en VITE_*, service role solo en edge functions)
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # NUNCA en una variable VITE_*
```

> En Lovable, configurar desde el panel de entorno (Lovable Cloud → Settings y/o Workspace → Build Secrets). No editar `.env` manualmente en el repo.

---

## 5. Pendientes de seguridad antes de producción real

1. **Cambiar el fallback `"hola"` del PasswordGate** o eliminar el fallback completamente, para que el gate falle de forma explícita si no hay `VITE_DEMO_PASSWORD`.
2. **Auditar las rutas seed-only** (`_app.attendance.tsx`, `_app.medical.restrictions.tsx`, `_app.economic.fees.tsx`, todas las `_app.rgcc.*`): hoy leen exclusivamente de `seed/`. Cuando se conecte backend real, reemplazar por queries Supabase con `demoOr/demoOrEmpty`.
3. **RLS de Supabase:** verificar que toda tabla expuesta vía cliente tenga políticas RLS activas y restrictivas. Ejecutar el escáner de seguridad de Lovable Cloud antes de publish.
4. **Service role key:** confirmar que `SUPABASE_SERVICE_ROLE_KEY` solo está en secretos de edge functions, nunca con prefijo `VITE_*`.
5. **`npm audit` real:** ejecutarlo fuera del sandbox de Lovable (CI o local) para confirmar el resultado, ya que el registry interno bloquea el endpoint `/security/audits`.
6. **Auth real:** sustituir el selector de roles demo por flujo de signup/login real con confirmación de email antes del despliegue de producción.
7. **Rotar la anon key actual** si el repositorio fue público en algún momento — aunque la anon key es por diseño pública, un cambio de proyecto Supabase requeriría rotar.
8. **CSP / cabeceras:** definir Content-Security-Policy para producción (no aplicado en este pase).
