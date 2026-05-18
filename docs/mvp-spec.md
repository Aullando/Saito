# MVP funcional SAITO — Spec canónica

Esta es la spec de la demo navegable. Cualquier nueva pantalla o cambio debe
encajar aquí. Lo marcado como **fuera de scope** no se construye en MVP.

## Canales
- **WebApp escritorio**: Gestor/Dirección, Administración, Staff médico.
- **App móvil**: Entrenador, Atleta.

## Selector inicial (`/login`)
5 perfiles: Gestor/Dirección, Administración, Staff médico, Entrenador, Atleta.

## WebApp — Gestor / Dirección
Dashboard global · Organización · Calendario · Pagos · Comunicación ·
Deportistas · Reporting básico · Notificaciones · IA resumen operativo.

## WebApp — Administración
Usuarios · Secciones · Categorías · Grupos · Horarios · Tutores ·
Cuotas y tasas · Aplicar cuota · Estado pagos · Circulares · Calendario de club.

## WebApp — Staff médico
Listado deportistas · Ficha deportista · Incidencias · Restricciones operativas ·
Citas médicas · Planes de tratamiento · Solicitudes de cita · Comunicación médica.

## App — Entrenador
Home · Calendario · Detalle sesión · Registrar asistencia · Generar convocatoria ·
Añadir notas · Registrar valoración · Solicitar feedback · Chats · Notificaciones ·
IA de sesión "Create with SAITO".

## App — Atleta
Home · Calendario · Detalle sesión · Notificar ausencia · Feedback post-sesión ·
Salud · Plan de tratamiento · Solicitar cita médica · Rendimiento · Chats ·
Circulares · Notificaciones.

## Reglas de visibilidad y permisos
- Cada rol ve solo lo que le corresponde.
- **Entrenador** no ve diagnóstico clínico. Solo ve **restricciones operativas**.
- **Atleta** solo ve sus propios datos.
- **Staff médico** ve datos sensibles.
- **Dirección** ve datos agregados (KPIs, reporting). No PII clínica detallada.

## Reglas de dominio
- **Circulares (MVP)**: listar, enviar, consultar canal de solo lectura para
  destinatarios. Estados avanzados (borrador, programada, archivada, retirada)
  son **Mejora propuesta V1.1**.
- **Chats (MVP)**: listar, abrir, enviar mensajes, adjuntar, tiempo real
  simulado, no leídos, marcar como leído. Archivar/eliminar son **Mejora
  propuesta V1.1**.
- **Eventos** se editan/cancelan/eliminan según permisos:
  - `canManageCalendarEvents` (admin, manager): crear, editar, cancelar,
    eliminar eventos generales (eliminar solo si no hay actividad asociada:
    asistencia, notas, pagos, convocatoria, comunicación, participantes).
  - `canManageMedicalAppointments` (admin, manager, medical): gestionar
    citas y solicitudes médicas.
  - `canEditSessionContent` (technical, admin, manager): contenido operativo
    de sesión (título, descripción, convocatoria, asistencia, notas,
    valoración, feedback, IA de sesión). **No** habilita editar eventos
    generales del calendario.
  - Atleta: solo consulta calendario, notifica ausencia, envía feedback.
- Al editar fecha, hora o ubicación: checkbox **Notificar a participantes**.

## Wellbeing / Salud deportiva
- Conceptos permitidos: salud deportiva, restricción operativa, plan de
  tratamiento bajo supervisión profesional, estado apto/no apto introducido
  por profesional, solicitud de cita médica, seguimiento, incidencia, cita
  médica.
- Banner obligatorio en pantallas sensibles:
  *"Información gestionada por personal autorizado. SAITO no sustituye el
  criterio profesional."*

## IA de sesión
- Solo uso deportivo/entrenamiento (calentamiento, bloque técnico, ejercicio
  principal, vuelta a la calma, variantes, material, tip de coach).
- Banner: *"Contenido generado por IA. Requiere validación humana antes de
  comunicar decisiones sensibles."*
- La IA **no** genera diagnóstico, tratamiento clínico, retorno al juego,
  alta médica ni recomendaciones médicas.

## Fuera de scope del MVP (no construir)
- WFC completo.
- Stripe real / billing SaaS real.
- Reporting avanzado.
- Auditoría legal avanzada.
- Panel DPO.
- Eventos recurrentes complejos.
- **Diagnóstico automático, IA médica, alta médica automática, retorno al
  juego (RTP) automático, predicción clínica, historia clínica certificada.**

## Mejoras propuestas V1.1 (no MVP)
- Archivar / eliminar chats.
- Archivar / retirar / eliminar circulares.
- Estados avanzados de circular (borrador, programada).
- Restaurar archivados.
- Auditoría avanzada.
- Retención legal configurable.

