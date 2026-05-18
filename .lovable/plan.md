# MVP funcional SAITO — plan de alineación

La demo ya cubre la mayor parte del MVP. Esta tarea no es rehacer nada: es **cerrar los huecos exactos** frente a la spec y dejarla escrita como contrato para que futuras pantallas no se desvíen.

## Estado actual vs spec

### Selector inicial (`/login`)
Ya existe con los 5 perfiles correctos (Gestor, Administración, Staff médico, Entrenador, Atleta) y canal desktop/mobile.
**OK** — sin cambios.

### WebApp Gestor / Dirección
| Spec | Estado |
|---|---|
| Dashboard global | ✅ `/dashboard` |
| Organización | ✅ `/club` |
| Calendario | ✅ `/calendar` |
| Pagos | ✅ `/economic/fees` |
| Comunicación | ✅ `/communication` |
| Deportistas | ✅ `/athletes` |
| Reporting básico | ✅ `/reports` |
| Notificaciones | ⚠️ campana existe, falta entrada de menú visible |
| IA resumen operativo | ⚠️ falta widget en Dashboard |

### WebApp Administración
| Spec | Estado |
|---|---|
| Usuarios | ✅ `/settings/team` |
| Secciones / Categorías / Grupos | ⚠️ hoy apuntan todos a `/club` (placeholders) |
| Horarios | ❌ falta |
| Tutores | ❌ falta |
| Cuotas y tasas | ✅ `/economic/fees` |
| Aplicar cuota | ❌ falta (acción) |
| Estado pagos | ✅ `/economic/payments` |
| Circulares | ✅ `/communication` (faltan estados) |
| Calendario de club | ✅ `/calendar` |

### WebApp Staff médico
| Spec | Estado |
|---|---|
| Listado / Ficha deportista | ✅ `/athletes` + sheet |
| Incidencias / Restricciones / Tratamientos / Solicitudes | ✅ `/medical/*` |
| Citas médicas | ✅ `/medical/calendar` |
| Comunicación médica | ✅ `/communication` |

### App Entrenador (móvil)
Home, Calendario, Detalle sesión, Asistencia, Convocatoria, Notas, Valoración, Feedback, Chats, Notificaciones, IA "Create with SAITO" → **todos presentes** en `_app.mobile.*` y `mobile/$tool`.
**OK.**

### App Atleta (móvil)
Home, Calendario, Detalle sesión, Notificar ausencia, Feedback, Salud, Tratamiento, Solicitar cita, Rendimiento, Chats, Notificaciones → **todos presentes**.
⚠️ Falta entrada explícita a **Circulares** del club en móvil atleta.

## Cambios a aplicar

1. **Sidebar Administración** — convertir Secciones/Categorías/Grupos/Horarios/Tutores/Aplicar cuota en entradas reales que abran vistas placeholder dentro de `/club` con tabs, en vez de 4 enlaces al mismo sitio.
2. **Sidebar Gestor** — añadir entrada "Notificaciones" (`/profile` o vista dedicada) e incrustar widget "IA — Resumen operativo" en `/dashboard` (texto generado, sin lógica real).
3. **Circulares (estados)** — en `/communication`, añadir badge de estado por circular: `borrador | programada | publicada | archivada | retirada`. Eliminar solo habilitado en `borrador` / no publicada. Pura UI sobre fixtures.
4. **App Atleta — Circulares** — añadir tile "Circulares del club" en `_app.mobile.index.tsx` (atleta) que enlace a una vista `mobile/$tool` = `circulars` reutilizando los datos de `/communication`.
5. **RoleGate de visibilidad** — añadir checklist en `src/lib/permissions.ts` (o equivalente) que codifique las reglas:
   - entrenador: ve restricciones operativas, **no** diagnóstico clínico
   - atleta: solo sus datos
   - médico: ve datos sensibles
   - dirección: solo datos agregados en `/reports` y `/dashboard`
   Aplicar a las pantallas afectadas (médica y dashboard).
6. **Documento de spec** — guardar este MVP como `docs/mvp-spec.md` y como memoria de proyecto (`mem://features/mvp-scope.md`) para que futuras tareas no introduzcan lo excluido (WFC, Stripe real, billing SaaS, reporting avanzado, DPO, IA médica, alta médica/RTP automáticos, recurrencias complejas).

## Detalles técnicos

- Sin migraciones, sin backend nuevo. Todo UI + fixtures.
- `Sidebar.tsx` → ampliar arrays `admin` y `manager`.
- `_app.communication.tsx` → añadir `status` en el modelo de circular + filtros + regla de borrado.
- Nueva ruta: `src/routes/_app.mobile.$tool.tsx` ya soporta `switch (tool)`; añadir `case "circulars"`.
- Memoria: escribir `mem://index.md` (Core: "Respetar scope MVP — ver memoria mvp-scope") + `mem://features/mvp-scope.md` con la lista de lo incluido/excluido y reglas de rol.

## Fuera de scope (no se construye)
WFC completo, Stripe real, billing SaaS, reporting avanzado, auditoría legal avanzada, panel DPO, eventos recurrentes complejos, diagnóstico/IA médica, alta médica y retorno al juego automáticos.
