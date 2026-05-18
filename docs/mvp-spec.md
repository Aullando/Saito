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
- **Circulares** tienen estados: `borrador`, `programada`, `publicada`,
  `archivada`, `retirada`.
- Solo se puede **eliminar** una circular si está en `borrador` o no publicada.
- **Chats** se pueden archivar o eliminar de mi bandeja.
- **Eventos** se pueden editar, cancelar o eliminar según reglas del rol.

## Fuera de scope del MVP (no construir)
- WFC completo.
- Stripe real / billing SaaS real.
- Reporting avanzado.
- Auditoría legal avanzada.
- Panel DPO.
- Eventos recurrentes complejos.
- **Diagnóstico automático, IA médica, alta médica automática, retorno al
  juego (RTP) automático.**
