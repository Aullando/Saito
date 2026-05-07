# SAITO Mockup — Alineación con extracción real BO QA

Refinar el mockup existente para que la experiencia, los textos, los datos y los layouts coincidan con la extracción real recibida (sysadmin, admin, manager, technical, medical). No se cambia el stack ni la arquitectura — sólo contenidos, naming, layout y pequeños comportamientos para subir la fidelidad de "demo bonita" a "se siente como SAITO BO QA real".

## Cambios por área

### Datos seed (sustituir por los reales no sensibles del BO)

- **Sysadmin user**: `SysAdmin SAITO · sysadmin@saito.app` (iniciales SS).
- **Admin del club**: `Carlos GARCÍA · clubadmin0@saito.app` (CG).
- **Manager**: `Carla LUIS · professional0@saito.app` (CL), idioma ES.
- **Technical Staff**: `Pol GUILLEN · professional20@saito.app` (PG), especialidad "Gestor".
- **Medical Staff**: `Pol ECHEVARRÍA · professional60@saito.app` (PE), Nº col. `LIC-PROF-2808XW`, especialidad "Fisioterapeuta", área "Gestor Deportivo".
- **Otros usuarios** que aparecen como autores en mensajes: mantener Carlos GARCÍA (admin), Carla LUIS (manager), Pol GUILLEN (técnico), Nadia ABAD (deportista) para que el inbox sea creíble.
- **Apellidos en mayúsculas** en toda la UI (`Carlos GARCÍA`, `raul4 GARC`, `Héctor CABELLO`, etc.) — añadir helper `formatName(first, last) => "${first} ${last.toUpperCase()}"`.
- **Secciones** reales: Deporte prueba, Test Section - Shared Staff, Test Section - Multi Role, Boxeo (Test), Esgrima, Gimnasia, Natación, Atletismo. Cada sección con contador `N deportistas` + dos contadores secundarios pequeños (ej. `3 2`, `7 9`) que la extracción muestra (probable: managers + staff técnico). Mostrarlos como dos pills numéricas.
- **Categorías** reales: Infantil, "Deporte prueba Test Shared Staff", Test Multi-Role, "Deporte prueba 70lbs (Test) Infantil", etc.
- **Grupos** reales: `Grupo 1`, `Grupo A`, `Grupo B`, `Grupo A - Titular`, `Grupo B - Reserva`, `AAA`, `Grupo Senior`.
- **Deportistas** reales (no sensibles): raul4 GARC, Athlete1 MULTIROLTEST, Athlete2 MULTIROLTEST, Héctor CABELLO, Miguel OCHOA, Eric NAVARRO, Jordi GUARDADO, Juan GRANADOS, Lorena TAMAYO, Erik LLORENTE, María Dolores GARZA, Nadia ABAD + relleno hasta ~25 con apellidos del listado actual para que la paginación tenga sentido.
- **Instalaciones**: Instalación Deportiva Valencia, Complejo Deportivo Barcelona, Centro Olímpico Madrid (sólo estas tres como en la captura).
- **Cuotas reales**: huhuhuhuhu 234 € Diario · Infantil-Grupo 1; "nueva cuota" 234 € Mensual 24/04/2026-24/04/2026; "para Granados" 1 € Mensual; "cuota 2" 190 € Mensual · Deporte prueba; "Grupo 1" 120 € Diario · Infantil-Grupo 1.
- **Otras tasas**: uuuu 345 € · Infantil-Grupo 1; Granados 10 €; tasa 2 148 € · Deporte prueba; Tasa 1 110 €.
- **Pagos**: ~113 registros para reproducir "Mostrando 1 a 10 de 113". Estados ES: `Pagada / Activa / Fallida / Pendiente`. Atletas mayoritarios: Juan GRANADOS, raul4 GARC. Importes 0 €, 120 €, 234 €.
- **Comunicación**: 2-3 conversaciones tipo "CI Circulares" (45 participantes / 1 participante) y un canal "G1 Grupo 1 Infantil" (10 participantes). Mensajes ES con campos: autor, rol (`Administrador de club`, `Gerente`, `Staff técnico`, `Deportista`), título, destinatario (`Todo el club (3 destinatarios)`, `Sección Atletismo (2 destinatarios)`, `Sección Deporte prueba > Infantil > Grupo Grupo 1 (11 destinatarios)`), hora `HH:MM`. Para Medical: 21 mensajes "Solicitud de cita médica" en inbox con `21 sin leer`.
- **Citas médicas**: una visible "09:00 - Miguel Ochoa" el día 19 del mes actual; resto ligeras.

### Sysadmin — Organizations

- Tabla con columnas exactas: **Name · Created · Updated · Status · AI**.
- Fechas formato `DD/MM/YYYY HH:MM` (ej. `29/04/2026 12:42`).
- AI como **texto Yes/No** (no Switch). El switch sólo en el drawer de detalle.
- Filtro "Filter by status" con select en EN.
- Paginación: `Previous Page · 1 · 2 · Next Page` (texto, no chevrons).
- Sidebar: ítem activo "Organizations" + "Profile & Settings" sólo. Header sidebar muestra contador `25` (notificaciones pendientes mock) sobre el avatar.

### Admin del Club & Manager — Club & Organization

- Layout: **Users and Permissions** (cards de Managers, Medical Staff, Technical Staff, Athletes, View All — sin contador grande, sólo título compacto en pill como en la captura).
- **Facilities**: 3 cards con nombre + botón `+`.
- **Organization Chart / Sports Sections**: cards con nombre + `N deportistas` + 2 mini-pills numéricos (los counters secundarios), botón "Nueva sección" / "New Section".
- Idioma: Admin EN, Manager ES con todos los textos:
  - "Club y Organización", "Usuarios y permisos", "Nueva alta", "Staff médico", "Staff técnico", "Deportistas", "Ver todos", "Instalaciones", "Organigrama", "Secciones deportivas", "Nueva sección".

### Calendar (admin/manager/technical)

- Cabeceras de día en ES para Manager/Technical: `Lun Mar Mié Jue Vie Sáb Dom` (ya está).
- Eventos compactos formato `HH:MM - <título>` (`06:00 - AAA`, `06:00 - Grupo A - Titular`, `07:00 - Grupo B - Reserva`).
- Mostrar hasta 3 eventos y `+N más` como hace la extracción (algunos días con +18). Generar suficientes eventos por día para que aparezca este patrón.
- Filtros `Seleccionar secciones / categorías / grupos` + `Limpiar filtros` (ya está; verificar EN/ES por idioma del usuario).
- Sin botón "Add" para Technical (lo confirma extracción: technical no tiene "Añadir").

### Athletes

- **Admin/Manager**: columnas `Nombre · Sección · Categoría · Grupos · Estado` (sin Estado Médico ni Performance). Acción `Ver ficha`.
- **Technical**: columnas `Nombre · Sección · Categoría · Grupos · Rendimiento · Estado Médico` y filtro `Filtrar por estado médico` (sin estado general).
- **Medical**: columnas `Nombre · Sección · Categoría · Estado Médico` (sin Grupos, sin Rendimiento). Filtros: estado médico, sección, categoría (sin grupo).
- Estado vacío exacto: "No athletes in this group" / "No hay deportistas en este grupo".
- Nombres con apellido en MAYÚSCULAS.

### Economic Management — Fees and Rates / Payment Status

- Tabs por sección como pills horizontales (no sidebar interno) para coincidir con la captura: Deporte prueba · Test Section - Shared Staff · Test Section - Multi Role · Boxeo (Test) · Esgrima · Gimnasia · Natación · Atletismo.
- Tabla **Cuotas** con columnas: `Nombre de cuota · Importe · Frecuencia · Periodo · Aplica a`.
- Tabla **Otras tasas**: `Nombre de tasa · Importe · Fecha de pago · Aplica a`.
- Formulario inferior con tabs `Cuota | Otras tasas`, campos `Nombre · Importe · Frecuencia (default Mensual) · Desde · Hasta · Añadir grupos`, botón `Añadir cuota`.
- Importes con formato `€` español: `234,00 €` (no `€234`).
- **Payment Status**: filtros `Todas las secciones · Todas las categorías · Todos los estados · Todas las cuotas`. Estados ES: `Pagada · Activa · Fallida · Pendiente`. Footer `Mostrando 1 a 10 de 113 registros` + paginación `1 2 3 4 5 ...` + selector `10` por página. Acción `Ver factura PDF` (no "View invoice").

### Communication

- Header de inbox: `Bandeja de entrada` + `N sin leer` (no Pill — texto literal como captura).
- Lista de conversaciones con avatar de iniciales `CI` (Circulares) o `G1` (Grupo 1) o `SM` (Solicitud médica), título y `N participantes` + hora `HH:MM` y badge contador a la derecha.
- Panel de mensaje: cabecera con `CI Circulares · 45 participantes`. Cada mensaje: avatar de autor + `Nombre Apellido` + `<Rol>` + título de circular + destinatario tipo `Todo el club (3 destinatarios)` o `Sección Deporte prueba > Infantil > Grupo Grupo 1 (11 destinatarios)` + hora.
- Composer con botón `Enviar mensaje`.
- Botón `Nueva circular` en cabecera.
- Para Medical: ~21 conversaciones repetidas tipo `Solicitud de cita médica` con `4 participantes` y badge `1`/`3` para reproducir el `21 sin leer`.

### Technical Staff — Calendario y Deportistas

- Sidebar reducido: Calendario · Deportistas · Comunicación · Perfil y configuración. Sin "Añadir" en calendario.
- Deportistas: filtro estado médico + columna Rendimiento (badge). Estado médico con valores `Apto / Lesionado / En revisión / Desconocido`.

### Medical Staff — Calendario médico, Deportistas, Comunicación

- Sidebar mostrando el contador `13` (notificaciones) en el header.
- Calendario médico ES: filtro `Seleccionar atleta` + `Limpiar filtros` + botón `Añadir`. Eventos formato `HH:MM - Nombre Apellido` (ej. `09:00 - Miguel Ochoa`).
- Deportistas: tabla sin Grupos, sin Rendimiento, filtros sin grupo.
- Comunicación: inbox con `21 sin leer`, lista poblada con `Solicitud de cita médica`.

### Profile & Settings

- Sysadmin: `SS · SysAdmin SAITO · sysadmin@saito.app · Settings · Notifications · Language English · Change Password`.
- Admin: `CG · Carlos GARCÍA · clubadmin0@saito.app · ... · Language English`.
- Manager: `CL · Carla LUIS · ... · Idioma Español`.
- Technical: `PG · Pol GUILLEN · Tipo de especialidad: Gestor · ... · Idioma Español`.
- Medical: `PE · Pol ECHEVARRÍA · Nº de colegiado LIC-PROF-2808XW · Tipo de especialidad Fisioterapeuta · Área Gestor Deportivo`.
- Mostrar Idioma como label estática (no toggle), `Notifications` como switch, `Change Password` como botón.

### UI/Layout ajustes globales

- **Topbar / sidebar header**: además del logo SAITO, mostrar el nombre del usuario en el sidebar superior (`Carlos GARCÍA`) tal como aparece en la extracción. Para Sysadmin/Medical mostrar contador numérico (25 / 13) sobre el avatar.
- **Sidebar items "Economic Management"**: cuando se entra a Cuotas o Pagos, mantener visibles los dos sub-items (Fees and Rates / Payment Status) indentados, como hace el BO real.
- **Calendario**: mostrar nombre de día abreviado en mayúsculas según idioma + nº día grande arriba a la izquierda de cada celda.
- **Tablas**: añadir footer `Mostrando X a Y de Z registros · selector de tamaño de página (10/25/50)` reutilizable.
- **Acciones**: renombrar literales para coincidir (`Ver factura PDF`, `Nueva alta`, `Nueva circular`, `Añadir`, `Hoy`, `Limpiar filtros`, `Filtrar por estado/sección/categoría/grupo`).

## Plan de implementación

1. Re-seed completo (`src/lib/seed.ts`): usuarios, secciones, categorías, grupos, deportistas, cuotas/tasas, ~113 pagos, conversaciones (incluida bandeja médica de 21), una cita médica el 19.
2. Helpers de formato: `formatName`, `formatDateTime` (DD/MM/YYYY HH:MM), `formatMoneyEs` (`234,00 €`).
3. Diccionario i18n: añadir todas las claves nuevas (`new_athlete`, `view_invoice_pdf`, `add_groups`, `showing_x_of_z`, etc.).
4. Sidebar: añadir nombre de usuario en cabecera y contador de notificaciones por rol; mantener sub-items económicos visibles cuando la ruta es económica.
5. Organizations: cambiar AI a Yes/No, formatear fechas, paginación textual.
6. Club & Organization: rehacer cards de Users/Permissions como pills compactas, Facilities a 3 cards reales, Sports Sections con contadores secundarios.
7. Calendar: aumentar densidad de eventos por día para reproducir `+18 más`; ocultar `Add` para Technical.
8. Athletes: variantes de columnas y filtros por rol según extracción.
9. Fees and Rates: tabs horizontales por sección + dos tablas + composer dual con tabs Cuota/Otras tasas.
10. Payments: ~113 registros, estados ES, paginación con conteo y page-size selector, acción `Ver factura PDF`.
11. Communication: estructura de inbox (avatar 2-letra, participantes, badges); panel con cabecera y mensajes formateados; semilla médica con 21 sin leer.
12. Medical Calendar: cita `09:00 - Miguel Ochoa` el día 19 del mes actual.
13. Profile: añadir todos los campos extra (Nº colegiado, Tipo de especialidad, Área) según rol.
14. QA visual final: comparar cada pantalla con su captura referenciada.

## Fuera de alcance

- Reproducir contenido ruidoso / nombres reales de mensajes QA (`uyfuyfuyf...`, `holahola`). Se mantienen mensajes limpios pero la **estructura** (autor, rol, destinatario, hora) se copia fiel.
- Cualquier credencial o email distinto al patrón `*@saito.app` ya visible.
- Fotos reales de avatares — seguimos usando iniciales.
