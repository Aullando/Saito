# Plan Operativo — Piloto SAITO

Versión: Alpha 1.0
Audiencia: Dirección del club piloto + equipo SAITO
Duración: 4–6 semanas

---

## 1. Objetivo del piloto

Validar que un club deportivo puede operar su día a día (dirección, staff técnico, médico, administración) sobre SAITO durante 4–6 semanas sin degradar sus procesos actuales y obteniendo, al menos, una mejora medible en trazabilidad, comunicación o tiempo de gestión.

No es un piloto comercial ni una demo extendida. Es una prueba de operación real con datos reales del club.

---

## 2. Qué se va a validar

- Que los 5 roles (Dirección, Técnico, Médico, Administración, Familia/Jugador) pueden completar sus tareas semanales dentro de SAITO.
- Que la información sensible (médica, económica, personal) queda segmentada por rol sin fugas entre perfiles.
- Que los flujos clave funcionan end-to-end: alta de jugador, planificación semanal, registro de asistencia, registro de restricción médica, comunicación a familias, cobro de cuota.
- Que el club entiende la herramienta sin acompañamiento continuo después de la semana 2.
- Que la trazabilidad mínima (quién hizo qué y cuándo) es suficiente para auditoría interna.

---

## 3. Qué queda fuera

- Integraciones con federaciones, ligas o sistemas de elegibilidad.
- Facturación fiscal certificada / TicketBAI / Verifactu.
- Pasarela de pago en producción (se simula).
- Entrenamiento de modelos de IA con datos del club.
- App móvil nativa (se usa la web responsive).
- Migración masiva de históricos (>1 temporada).
- Multi-club / multi-tenant cruzado.
- Integraciones con wearables, GPS o plataformas de vídeo.

---

## 4. Roles participantes

| Rol | Perfil real en el club | Compromiso semanal |
|---|---|---|
| Dirección / Board | 1 persona (gerente o director deportivo) | 30 min |
| Dirección deportiva | 1 persona | 1 h |
| Staff médico/fisio | 1 persona | 45 min |
| Entrenador | 2–3 personas (equipos distintos) | 1 h |
| Administración | 1 persona | 1 h |
| Familias / jugadores | 10–20 cuentas reales | uso libre |

Total: ~6–8 usuarios activos del staff + muestra de familias.

---

## 5. Datos necesarios del club

Antes de la semana 1 el club debe entregar:

- Listado de equipos/grupos y categorías reales (nombre, deporte, temporada).
- Listado de jugadores por equipo (nombre, fecha de nacimiento, tutor si menor).
- Listado de staff con rol asignado y email corporativo.
- Estructura de cuotas vigente (concepto, importe, periodicidad).
- Calendario tipo de una semana de entrenamientos.
- Documento de consentimiento RGPD vigente del club (para revisar compatibilidad).

Formato: Excel o CSV. SAITO carga los datos manualmente en la semana 0.

---

## 6. Checklist de onboarding

**Semana 0 — preparación (SAITO)**
- [ ] Crear tenant del club en entorno aislado.
- [ ] Cargar equipos, jugadores, staff y cuotas.
- [ ] Asignar roles y enviar credenciales temporales.
- [ ] Configurar visibilidad médica y económica por defecto.
- [ ] Verificar que los textos provisionales y dominios genéricos están limpios.
- [ ] Generar checklist QA interno (`/settings/qa`) en verde.

**Semana 1 — arranque (club)**
- [ ] Cada usuario del staff hace login y cambia contraseña.
- [ ] Recorrido guiado por rol (1 sesión de 45 min).
- [ ] Confirmación de que el calendario de la semana es correcto.
- [ ] Envío de invitación a 10–20 familias piloto.

---

## 7. Flujos que se probarán

1. **Alta y baja de jugador** — Administración da de alta, Técnico lo asigna a equipo, Familia recibe acceso.
2. **Planificación semanal** — Técnico crea entrenamientos, Familia los ve.
3. **Asistencia** — Familia confirma, Técnico registra asistencia real, Dirección ve agregado.
4. **Restricción médica** — Médico registra lesión con visibilidad limitada, Técnico ve sólo "no disponible", Dirección ve agregado anonimizado.
5. **Comunicación** — Administración envía circular a un grupo, lectura confirmada.
6. **Cobro de cuota** — Administración emite cuota, Familia ve estado, marca pago manual.
7. **Dashboard de Dirección** — KPIs reales del club al final de cada semana.

Cada flujo se valida con un caso real del club, no inventado.

---

## 8. Métricas de éxito

| Métrica | Umbral mínimo |
|---|---|
| Usuarios staff activos / semana | ≥ 80 % |
| Familias que entran al menos 1 vez | ≥ 50 % |
| Flujos completados sin soporte | ≥ 5 de 7 |
| Incidencias bloqueantes abiertas | 0 al cierre |
| Tiempo medio de registro de asistencia | < 2 min por sesión |
| Comunicaciones leídas | ≥ 60 % |
| NPS staff (1–10) | ≥ 7 |

---

## 9. Riesgos críticos

- **Fuga de datos médicos** entre perfiles — mitigación: revisión semanal de visibilidad y logs.
- **Resistencia del staff** a abandonar WhatsApp/Excel — mitigación: sesiones cortas semana 1 y 2.
- **Datos del club mal cargados** — mitigación: validación firmada por administración antes de semana 1.
- **Dependencia de una sola persona** en el club — mitigación: mínimo 2 usuarios por área.
- **Caída del entorno** — mitigación: backup diario, RTO < 24 h documentado.
- **Expectativa de cumplimiento legal certificado** — mitigación: dejar por escrito que el piloto NO certifica RGPD/LOPDGDD.

---

## 10. Criterios de parada

El piloto se detiene de forma inmediata si:

- Se produce una fuga de datos personales o médicos verificable.
- Se pierden datos operativos sin posibilidad de restauración.
- Más del 50 % del staff abandona el uso durante 2 semanas consecutivas.
- Se detecta un fallo de seguridad de severidad alta sin parche en 72 h.
- El club lo solicita por escrito.

---

## 11. Plan semanal (4–6 semanas)

| Semana | Foco | Responsable principal | Entregable |
|---|---|---|---|
| 0 | Carga de datos y configuración | SAITO | Tenant operativo |
| 1 | Onboarding staff + recorrido por rol | SAITO + Dirección club | Staff con login activo |
| 2 | Operación real básica: calendario + asistencia + comunicación | Club | Primera semana operada |
| 3 | Incorporación módulo médico y económico | Club | Restricciones y cuotas vivas |
| 4 | Operación autónoma sin soporte directo | Club | Métricas semana 4 |
| 5 (opcional) | Estabilización e incidencias | Club + SAITO | Backlog cerrado |
| 6 (opcional) | Evaluación y decisión | Dirección club + SAITO | Informe final |

Reunión de seguimiento semanal: 30 min, viernes.

---

## 12. Decisión final esperada

Al cierre del piloto, la Dirección del club y SAITO firman conjuntamente una de estas tres decisiones:

- **Continuar** — pasar a contrato anual, ampliar a más equipos o módulos. Requiere cumplir ≥ 6 de 7 métricas y 0 incidencias bloqueantes.
- **Corregir y reintentar** — extender 4 semanas más con backlog acordado. Requiere identificar causa concreta y plan de corrección con fechas.
- **Descartar** — cierre del piloto, exportación de datos al club en 15 días, eliminación del tenant en 30 días.

No hay cuarta opción ambigua. La decisión se toma con datos, no con sensaciones.
