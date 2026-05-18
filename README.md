# SAITO

Aplicación de gestión multi-club construida sobre **TanStack Start** + **Lovable Cloud**.

> Este proyecto está optimizado para ejecutarse en [Lovable](https://lovable.dev) y para
> instalarse localmente con **npm**. No depende de Bun, pnpm ni yarn.

---

## Requisitos

- Node.js ≥ 20
- npm ≥ 10 (declarado en `package.json` con `"packageManager": "npm@10"`)

## Instalación local

```bash
npm ci
npm run dev
```

La app arranca en `http://localhost:5173` (puerto por defecto de Vite).

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright). Requiere `npx playwright install chromium` la primera vez |

---

## Variables de entorno

**No se versiona ningún `.env` real.** El archivo `.env` está en `.gitignore`. Solo
`.env.example` se mantiene en el repositorio como plantilla y documentación.

En **Lovable** las variables se configuran desde el panel de entorno (Lovable Cloud →
Settings, o Workspace → Build Secrets para variables de build). En local, copia
`.env.example` a `.env` y rellénalo.

### Reglas de seguridad

- Las variables con prefijo `VITE_*` se inyectan en el bundle del navegador y son
  **públicas**. Cualquier visitante puede leerlas en DevTools.
- **Nunca** pongas una `SERVICE_ROLE_KEY` (ni cualquier secreto del servidor) en una
  variable `VITE_*`. Solo claves *publishable / anon* son aceptables ahí.
- Los secretos reales (service role, claves de proveedores externos) viven en
  Supabase Edge Function secrets / Lovable Cloud secrets.

### Configuración recomendada

**Preview comercial (público, sin contraseña):**

```env
VITE_DEMO_MODE=true
VITE_SHOW_DATA_SOURCE_BADGE=true
VITE_ENABLE_PASSWORD_GATE=false
```

**Demo privada (gate por contraseña):**

```env
VITE_DEMO_MODE=true
VITE_SHOW_DATA_SOURCE_BADGE=true
VITE_ENABLE_PASSWORD_GATE=true
VITE_DEMO_PASSWORD=change-me
```

**Producción real:**

```env
VITE_DEMO_MODE=false
VITE_SHOW_DATA_SOURCE_BADGE=false
VITE_ENABLE_PASSWORD_GATE=false
# + claves Supabase reales
```

---

## Modo demo vs modo producción

El proyecto puede correr **sin backend configurado** gracias al modo demo:

- `VITE_DEMO_MODE=true` (o sin definir): cuando una query falla o no hay datos, se
  muestran datos seed para que la demo siga viéndose completa. El badge
  `Demo · Datos demo` aparece si `VITE_SHOW_DATA_SOURCE_BADGE=true`.
- `VITE_DEMO_MODE=false`: las queries que fallen muestran error / estado vacío.
  **Nunca** se sirven datos seed silenciosamente como si fueran reales. El badge
  cambia a `Producción · Datos reales`.

Helpers en `src/lib/appMode.ts` y `src/lib/demoFallback.ts`.

## PasswordGate

El componente `src/components/PasswordGate.tsx`:

- Está **desactivado por defecto**. Solo se activa con
  `VITE_ENABLE_PASSWORD_GATE=true`.
- Si está activo, lee la contraseña **exclusivamente** de `VITE_DEMO_PASSWORD`.
  **No existe contraseña por defecto** (`"hola"` ha sido eliminado): si
  `VITE_DEMO_PASSWORD` no está definida, el gate bloquea el acceso y muestra
  un error de configuración explícito.
- **No es seguridad real**, solo gating de demo. La contraseña viaja al cliente.

## Rutas de la App móvil

- `/mobile` es la **única App móvil oficial** (frame 390px, sin sidebar,
  navegación inferior). Entrenador en verde Coaching (#00A74D), Atleta en rojo
  Sport Life (#F12F4A).
- `/demo/mobile/coach` y `/demo/mobile/athlete` están **deprecadas** y
  redirigen a `/mobile` fijando el rol correspondiente. No mantener
  experiencias alternativas en esas rutas.

---

## Despliegue

El despliegue se hace desde Lovable con el botón **Publish**. Los cambios de
backend (edge functions, migraciones) se despliegan automáticamente; los cambios
de frontend requieren pulsar "Update" en el diálogo de publish.
