# Fase 2: reglas propuestas

Cada propuesta se deriva de los hallazgos de engineering-findings.md. Se implementará en .agents/rules en la fase 3 con nombre, alcance, justificación e instrucciones, y se comprobará mediante una tarea real y pequeña. Estado de todas las propuestas: pendientes de implementación y validación.

## R1 — Mantener el contrato de movimientos

**Alcance:** rutas del backend, tipos y consumidores del frontend. **Evidencia:** H1, H6.

Antes de cambiar un movimiento, comparar FinancialMovement en backend/app/routes.py y frontend/src/lib/financial-types.ts. Mantener nombres, formatos de fecha y valores admitidos coordinados con el consumidor de App.tsx. Si una tarea cambia el contrato, actualizar los lados afectados y sus pruebas. No afirmar que TypeScript valida el JSON recibido.

**Tarea real prevista:** revisar el contrato actual y registrar una comparación de campos con una muestra de /api/metrics. Si se detecta discrepancia, corregir únicamente esa discrepancia. **Criterio:** comparación verificable, respuesta compatible y pruebas relevantes cuando haya cambio.

## R2 — Comprobar cálculos y períodos

**Alcance:** financial-utils.ts, sus pruebas y etiquetas de período. **Evidencia:** H2, H3, H6.

Mantener los cálculos en lib, conservar beneficio = ingresos - gastos y porcentaje = beneficio / ingresos * 100 con 0 cuando no hay ingresos. Al modificar agrupación, comprobar cambio de año y límites de mes. No cambiar moneda o redondeo sin una necesidad de la tarea. Para fechas ISO sin hora, comprobar explícitamente el efecto de la zona horaria antes de afirmar que el mes es correcto.

**Tarea real prevista:** reproducir el riesgo de mes en una zona horaria negativa; si se confirma, aplicar una corrección mínima con una prueba que detecte el fallo y conservar las pruebas existentes. **Criterio:** evidencia antes/después y resultados correctos entre meses y años.

## R3 — Seguir la estructura existente

**Alcance:** frontend/src y configuración del alias @. **Evidencia:** H4.

Usar App para obtención de datos y estados, lib para transformaciones financieras, dashboard para presentación y ui para componentes reutilizables. Seguir los nombres existentes al crear un archivo. Si se cambia un alias, revisar Vite y TypeScript juntos. Evitar duplicar fórmulas dentro de componentes visuales.

**Tarea real prevista:** realizar la corrección mínima del período mostrado usando esta separación: derivar el período a partir de los movimientos y pasarlo al encabezado, con comprobación del cálculo. **Criterio:** etiqueta coherente con las fechas, sin fórmula duplicada en el encabezado; build y lint correctos.

## R4 — Verificar el arranque por capas

**Alcance:** Docker Compose, Vite, variables de entorno y comprobaciones. **Evidencia:** H5, H6, H8.

Usar el setup documentado con Docker Compose. Ante problemas de comunicación, comprobar backend /health y frontend /api/metrics por separado y revisar contenido y estado HTTP. Mantener el destino por defecto http://backend:8000. Si el entorno requiere API_PROXY_TARGET, obtener su valor del entorno real y guardarlo en .env.local ignorado; documentar la variable en .env.example sin secretos. Diferenciar esta variable de VITE_API_BASE_URL. No presentar una ruta alternativa como causa raíz resuelta.

**Tarea real prevista:** comprobar el arranque en este Codespace y actualizar únicamente instrucciones que no sean reproducibles. **Criterio:** comandos y respuestas registrados, sin IP fija incorporada al código ni archivos locales en el commit.

## R5 — Documentar evidencia y entregar por fases

**Alcance:** documentación, verification.md, memory-bank y commits. **Evidencia:** H3, H7, H8.

Antes de actuar, consultar las ubicaciones indicadas por AGENTS.md. Para cada afirmación técnica, indicar archivo y símbolo o una comprobación observable. Separar hecho verificado, inferencia y pendiente; distinguir API implementada de interfaz que la utiliza. Actualizar el rastro de verificación cuando cambie una conclusión. Revisar el diff y guardar un commit por fase; excluir .env.local, dependencias y artefactos generados. No atribuir al alumno revisiones personales que no haya realizado.

**Tarea real prevista:** corregir la documentación del período y estado actual tras las tareas anteriores, revisando referencias y el diff. **Criterio:** afirmaciones coherentes con el código final, pendientes explícitos y commit separado de fase 3.

## Estado posterior — 2026-10-02

Las propuestas anteriores son el registro de fase 2. En fase 3 se implementaron R1–R5 en .agents/rules y se refinaron después de las tareas reales descritas en docs/rules-validation.md. Sus resultados no se deben confundir con las tareas que todavía estaban previstas en este documento inicial.
