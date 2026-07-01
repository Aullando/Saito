# SAITO — Demo Interactiva

Plataforma multi-club para gestión deportiva. **Este repositorio es una demo comercial**: sin backend real, sin billing, sin datos de producción. Todo el estado vive en el navegador (Zustand + localStorage) y los seeds son ficticios.

## Acceso

- **URL**: la que sirva la preview / hosting
- **Contraseña del gate**: `SIHSAITO`
- Tras el gate se cae en `/login`, donde se elige **club** y **rol**.

## Clubes incluidos

| Club | Slug | Perfil |
|---|---|---|
| **SAITO** | `saito-demo` | Club deportivo multi-sección (atletismo, fútbol, natación, baloncesto, gimnasia) |
| **RGCC — Real Grupo Cultura Covadonga** | `rgcc` | Club social multidisciplinar con salas, fitness, escuelas |
| **CNSO — Club Natación Santa Olaya** | `cnso` | Club de natación (calles de agua, competición, tecnificación) |
| **GFF — Gulf Football Federation** | `gff-demo` | Federación en árabe/inglés para presentación internacional |

## Roles

Cada rol ve **solo su superficie**. Se demuestra explícitamente:

- **Dirección (manager)** — vista completa del club
- **Administración (admin)** — socios, cuotas, pagos, comunicación
- **Staff médico** — incidencias sanitarias con diagnóstico, restricciones, calendario médico
- **Entrenador (technical)** — mobile-only: sesiones, drills, restricciones operativas **sin** diagnóstico
- **Atleta / Nadador** — mobile-only: su día, sus marcas, sus mensajes

## Idiomas

Selector ES/EN en la topbar (AR/EN para GFF). Toda la UI **y** los datos demo cambian de idioma en tiempo real.

## IA (Copiloto)

- Chat contextual conectado a `ai-chat` (edge function con Lovable AI Gateway).
- Ejecuta **14 acciones reales** sobre el estado demo: marcar pagos, mover eventos, cambiar estado médico, enviar mensajes, etc.
- El rol activo determina qué acciones puede pedir.

## Estructura

```
src/
  routes/           Rutas TanStack (una por módulo)
  clubs/            Perfil por club: sidebar, seed, aiContext, mobile workspace
  components/       UI compartida (Sidebar, Topbar, AIChat, PasswordGate…)
  lib/              i18n, demoI18n, store, tipos, seeds
supabase/functions/
  ai-chat/          Copiloto conversacional con tool calls
```

## Recorrido comercial recomendado

1. **Login → SAITO → Dirección** — dashboard, KPIs, calendario, comunicación.
2. **Cambiar a rol médico** — mostrar filtrado (solo salud, con diagnóstico).
3. **Cambiar a rol entrenador (móvil)** — mismas incidencias sin diagnóstico.
4. **Selector de club → CNSO** — mismo esqueleto, otro deporte, otro branding.
5. **Copiloto** — "marca como pagado el próximo pago pendiente".
6. **Toggle EN** — todo se traduce, incluidos seeds.

## Fuera del alcance MVP

WFC, Stripe real, billing SaaS, reporting avanzado, panel DPO, IA médica clínica, alta médica automática, recurrencias complejas. Ver `docs/mvp-spec.md`.
