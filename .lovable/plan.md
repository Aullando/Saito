# SAITO Backoffice — Mockup Funcional

App web tipo SaaS deportivo con 5 roles (SysAdmin, Admin Club, Manager, Technical Staff, Medical Staff), navegación por rol, datos ficticios conectados y persistencia local. Sin backend real.

## Alcance funcional

- **Login** con selector rápido de demo users (un usuario por rol). Sin credenciales reales.
- **Layout global**: sidebar 224px (logo SAITO arriba, menú por rol, perfil abajo), topbar con campana + avatar + nombre.
- **Idioma por usuario**: SysAdmin/Admin en inglés, Manager/Technical/Medical en español.
- **Persistencia** de estado (usuario actual, datos editados, mensajes, pagos) en `localStorage` vía Zustand.

### Pantallas por rol

**SysAdmin** (EN)
- Organizations: tabla con filtro status, paginación, modal "New organization", drawer detalle, toggle AI.
- Profile & Settings.

**Admin del Club** (EN) y **Manager** (ES, menos permisos administrativos)
- Club & Organization: Users & Permissions (cards Managers/Medical/Technical/Athletes/View All + "New User"), Facilities (cards + plus), Organization Chart, Sports Sections (cards con contadores + "New Section").
- Calendar: vista mensual, filtros sección/categoría/grupo, "Today", navegación mes, modal Add event, drawer detalle, "+N more".
- Athletes: tabla con filtros status/section/category/group, búsqueda, modal New Athlete, drawer ficha (datos, secciones, pagos, eventos, médico).
- Economic Management → Fees and Rates: tabs por sección, tabla Fees, tabla Other rates, side modal crear fee.
- Payment Status: tabla con filtros, estados (Paid/Active/Failed/Pending), ver factura PDF mock, marcar pagado, exportar CSV.
- Communication: inbox (lista + panel mensaje + composer), badges no leído, modal "New circular" con filtros destinatario.
- Profile & Settings.

**Technical Staff** (ES) — sin economía/admin
- Calendario (filtros + agenda técnico).
- Deportistas (tabla con filtro estado médico, ficha con rendimiento, médico solo lectura).
- Comunicación.
- Perfil.

**Medical Staff** (ES)
- Calendario médico (filtro atleta, modal Añadir cita, drawer cita).
- Deportistas (ficha médica, historial citas, "Añadir nota médica").
- Comunicación.
- Perfil (colegiado, especialidad, área).

### Modales y drawers obligatorios
Modales: New organization, New user, New section, New athlete, Add calendar event, Add medical appointment, New circular, Add fee.
Drawers: Organization detail, Athlete profile, Calendar event detail, Payment detail.

## Diseño visual

- Fondo `#F4F7FB`. Sidebar blanco-azulado claro. Activo azul `#0074D9` con pill radius 999.
- Texto principal `#1F2A44`, secundario `#6B7894`.
- Cards blancas, radius 20–24px, sombra suave.
- Botones primarios pill azul sólido.
- Tipografía Inter/Manrope. Iconos lineales (Lucide).
- Logo SAITO: texto bold + isotipo circular multicolor abstracto.
- Tablas densas con header azul/gris suave, empty states amistosos.
- Calendario grid lun-dom, días fuera de mes en gris, eventos compactos azul.

## Detalles técnicos

**Stack**: React + TypeScript + TanStack Router (ya instalado), Tailwind v4, shadcn/ui (ya disponible), Lucide, Zustand + persist middleware.

**Tokens**: añadir a `src/styles.css` los semantic tokens del esquema SAITO (`--primary`, `--sidebar-*`, `--card`, etc.) en oklch — sin hardcodear colores en componentes.

**Routing** (TanStack file-based en `src/routes/`):
```
/login
/_app                       (layout con sidebar+topbar, guardia rol)
  /                         (dashboard redirige por rol)
  /organizations            (SysAdmin)
  /club                     (Admin/Manager)
  /calendar
  /athletes
  /athletes/$athleteId      (drawer vía search param)
  /economic/fees
  /economic/payments
  /communication
  /medical/calendar         (Medical)
  /profile
```
Sidebar dinámico construido a partir de un map `role → menuItems[]`.

**Estado** (Zustand stores con persist):
- `authStore`: currentUser, switchDemoUser().
- `dataStore`: organizations, users, facilities, sections, categories, groups, athletes, events, fees, payments, conversations, messages, medicalAppointments. Acciones CRUD mock.
- `uiStore`: sidebar collapsed, drawer/modal abiertos, filtros por pantalla.

**Datos mock** conectados según el modelo dado en el prompt. Seed inicial al primer arranque con: 10 organizaciones (European Commission, Sport Innovation Hub SL, Saito Club, Athletic Club Bilbao, FC Barcelona, Real Madrid CF, federaciones), facilities (Valencia/Barcelona/Madrid + Stadium/Gym/Pool/Medical Room), secciones (Boxeo, Esgrima, Gimnasia, Natación, Atletismo, Deporte prueba, Test sections), ~30 deportistas, eventos en mes actual, fees, pagos en varios estados, conversaciones con mensajes limpios, citas médicas.

**i18n**: diccionario simple `{ en, es }` en `src/lib/i18n.ts` + hook `useT()` que lee `currentUser.language`. Todas las strings de UI pasan por el diccionario.

**Permisos**: helper `canAccess(role, route)` y `<RoleGate roles={[...]}>`. Sidebar y rutas filtran por rol.

**Export CSV mock**: genera blob CSV en cliente y dispara descarga.
**Factura PDF mock**: abre nueva ventana con HTML estilizado (no librería pesada).

## Plan de implementación

1. Tokens de diseño + tipografía + componente `Logo` SAITO.
2. Stores Zustand (auth, data con seed, ui) + i18n.
3. Layout `_app` con `Sidebar` dinámico por rol + `Topbar`.
4. Pantalla Login con selector demo y guardia de rutas.
5. SysAdmin: Organizations (tabla + filtros + modal + drawer).
6. Admin/Manager: Club & Organization, Calendar mensual, Athletes (tabla + drawer ficha).
7. Economic Management: Fees and Rates, Payment Status (CSV + factura mock).
8. Communication (3 zonas + composer + new circular).
9. Technical Staff: vistas filtradas (calendario, deportistas, comunicación).
10. Medical Staff: calendario médico + ficha médica + notas.
11. Profile & Settings (común, con campos extra para Medical).
12. Pulido visual: empty states, paginación, badges, "+N more", responsive básico.

## Fuera de alcance

- Backend, autenticación real, emails reales.
- Generación de PDFs con librería (se usa HTML imprimible).
- Mobile nativo / PWA offline avanzada.
- Tests automatizados.
