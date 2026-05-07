# Ajustes de precisión SAITO BO

Aplicar los design tokens exactos extraídos del backoffice real y refinar pantallas clave para que coincidan visualmente con las capturas.

## 1. Tokens exactos (`src/styles.css`)

Reemplazar los tokens actuales por los valores RGB exactos:

- `--background`: `rgb(247, 249, 252)` → oklch equivalente
- `--foreground`: `rgb(26, 32, 44)` (texto principal)
- `--muted-foreground`: `rgb(113, 125, 150)` (links sidebar)
- `--input`: bg `rgb(255,255,255)`, color `rgb(45,54,72)`, **radius 10px**, **height 40px**
- `--card`: bg blanco, **radius 25px** (no 1.25rem actual)
- Tabla: header 46px, fila 57px
- Sidebar item activo: `203x42`, fondo sutil
- Tipografía: Inter 14/400 base, headings 700

Añadir utilidades:
- `.saito-card` → `border-radius: 25px`
- `.saito-input` → `height: 40px; border-radius: 10px`
- `.saito-table-row` → `height: 57px`
- `.saito-table-head` → `height: 46px`

Cargar Inter desde Google Fonts en `__root.tsx`.

## 2. Sidebar (`src/components/Sidebar.tsx`)

- Items 175x45, color inactivo `rgb(113,125,150)` weight 500
- Item activo: 203x42, fondo `bg-primary/10`, color `rgb(26,32,44)`, radius pill
- Fondo sidebar más claro (casi blanco)
- Logo SAITO arriba, sin texto extra

## 3. Tabla genérica

Crear `DataTable` reutilizable en `ui-kit.tsx`:
- Header 46px, texto sm semibold
- Filas 57px, hover sutil
- Paginación textual: "Mostrando X a Y de Z" + números de página
- Page-size selector

Aplicar a: organizations, athletes, fees, payments.

## 4. Inputs y selects

Todos los `<Input>` y `<Select>` del proyecto → 40px alto, radius 10px, bg blanco, borde sutil. Override en `src/components/ui/input.tsx` y `select.tsx` para alinear con el spec.

## 5. Cards (Club & Organización)

- Card 745x156 (instalaciones), radius 25px
- Sección "Usuarios y permisos" con 3 sub-cards (Staff médico / técnico / Deportistas) + "Nueva alta"
- Sección "Organigrama" con cards de secciones deportivas mostrando "X deportistas" y dos contadores pequeños (staff/managers)

## 6. Calendario

- Header: "Hoy" + "Mayo 2026" + flechas + filtros (secciones, categorías, grupos) + "Limpiar filtros" + "Añadir"
- Grid 7 columnas, día number arriba-izq
- Eventos: "HH:mm - Nombre" en chip pequeño azul; "+N más" cuando hay overflow
- Calendario médico: chips naranjas, filtro "Seleccionar atleta"

## 7. Ficha atleta (drawer/route)

Layout exacto:
- Header: "Nombre APELLIDO" + botón "Añadir a staff técnico"
- Bloque info: Sección / Categoría / Grupos / Nº Licencia / Nº Seguro médico / Altura / Peso / Estado Médico
- Bloque "Cuotas Aplicables al Atleta" con tabla y botón "Suscribir"
- Vista médica: añadir "Historial de incidencias", "Registrar Incidencia", "Planes de tratamiento activos/finalizados"
- Vista técnica: añadir "Notas de Sesión" con calendario mensual

## 8. Pagos y Cuotas

- Cuotas: tabs por sección, dos tablas (Cuotas / Otras tasas), formulario inline "Añadir cuota"
- Pagos: filtros (sección/categoría/estado/cuota), tabla con StatusPill (Pagada=success, Activa=primary, Fallida=danger, Pendiente=warning), formato `0,00 €` y `DD/MM/YYYY`

## 9. Comunicación

- Layout 2 columnas: lista conversaciones (izq) + detalle (der)
- Conversación: avatar circular con iniciales, título, "X participantes", hora, badge unread
- Mensaje: avatar + nombre + rol pequeño + título + "(X destinatarios)" + cuerpo + hora
- Inbox médico: 21 sin leer, conversaciones "Solicitud de cita médica"

## 10. Perfil

- Card avatar grande con iniciales en círculo de color
- Nombre, email, (médico) Nº colegiado / especialidad / área
- Card Ajustes: Notificaciones (switch), Idioma (texto), Cambiar contraseña (link/btn), Reset demo

## 11. Login

- Card centrada radius 25, logo SAITO, título "Log In", inputs email/password (40px), "Forgot your password?", botón "Continue", selector demo de 5 roles abajo

## Detalles técnicos

- Convertir RGB exactos a oklch con `culori` mental o aproximación
- No tocar lógica de store/seed salvo que falte data para reflejar pantallas
- Mantener i18n existente
- AIChat sigue presente en AppLayout
