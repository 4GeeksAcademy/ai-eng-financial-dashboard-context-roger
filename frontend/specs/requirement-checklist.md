# Revisión del enunciado y criterios de evaluación

Auditoría del agente realizada el 2026-10-05 contra el enunciado completo de [4Geeks](https://learn.4geeks.com/es/main-cohort/spain-aie-pt-5/syllabus/working-with-ai-coding-agents-v3/project/company-financial-dashboard-specs-project?moduleId=3), incluidas las cuatro fases, los doce criterios de evaluación, el inicio y la entrega. Las 28 filas corresponden a las 28 casillas técnicas del proyecto; no son una certificación de nota ni sustituyen la revisión personal del alumno.

## Preparación, alcance y entrega

- Mismo repositorio del trabajo de contexto: se conserva su historial, sus reglas y su memory-bank; no se creó un fork nuevo.
- Rama feature/frontend-specs; todas las especificaciones están en frontend/specs/.
- Backend activo y /docs revisado antes de redactar; se siguió evidence-delivery y verification.md registra la revisión.
- Memoria actualizada y reglas previas versionadas. Ningún cambio de backend ni frontend/src en esta entrega.
- Rama publicada en el mismo origin. La URL de entrega incluye feature/frontend-specs para que el instructor vea los archivos; compartirla con el instructor queda a cargo del alumno.

## Las 28 casillas contrastadas

| Nº | Fase / criterio del enunciado | Resultado y evidencia |
|---|---|---|
| 1 | F1: Mapear endpoints, respuestas y query mediante /docs | Verificado en Swagger/OpenAPI activo; [verification.md](verification.md) y tablas de endpoints en [README.md](README.md) |
| 2 | F1: Contrastar patrones de fetch del frontend | Revisado App.tsx: API_BASE_URL, response.ok y proxy; contrato común de README.md |
| 3 | F1: Anotar y resolver desajustes PM/API | Matriz de afirmaciones en verification.md; resoluciones de media móvil y categorías en README.md |
| 4 | F1: Rastro de verificación opcional | verification.md y mensajes de commit con evidencia |
| 5 | F2: Respuestas FacetsResponse, AlertEntry, AlertsResponse, CategoryEntry, TopCategoriesResponse | Todas en [api-types.ts](api-types.ts); respuestas lista representadas como alias de array, sin inventar envoltorios |
| 6 | F2: DateRangeFilter, AlertsParams y TopCategoriesParams | En [param-types.ts](param-types.ts), con campos reales de query |
| 7 | F2: Nombres/tipos verificados, TS estricto sin any/object | Comparación de campos, enums, requeridos y tipos con OpenAPI; strict=true en tsconfig.json |
| 8 | F2: JSDoc en cada propiedad | JSDoc revisado para cada propiedad declarada de respuesta y query, con formato/valores cuando corresponde |
| 9 | F2: Commit de tipos verificados | f743881; contratos contrastados antes del commit |
| 10 | F3: components.md por funcionalidad | [components.md](components.md): filtro, alertas y comparativa |
| 11 | F3: Props alineadas y ambigüedades resueltas | Props referencian DateRangeFilter, FacetsResponse, SummaryResponse, enums y modelos de presentación declarados; no atribuye campos derivados al JSON |
| 12 | F3: Commit de componentes | 5fdee5a; props, composición y estados condicionales |
| 13 | F4: README con endpoints/tipos/restricciones y ≥2 casos límite por función | README.md incluye las tres tablas de contratos y 8 casos por funcionalidad |
| 14 | F4: Lectura como entrega a sesión nueva | Segunda revisión completa de flujo, fuentes de datos, formatos, fechas individuales, errores, ventanas, catálogo y totales; decisiones explícitas en README/components |
| 15 | F4: Ejecutar npx tsc --noEmit y corregir | Comando ejecutado; además proyecto specs estricto y proyecto src, con registro en verification.md |
| 16 | F4: Commit del contrato README | be81047; incluye evidencia y actualización de memoria |
| 17 | Evaluación: API explorada con tipos/endpoints trazables | verification.md y referencias a modelos de /openapi.json; sin nombres inventados |
| 18 | Evaluación: Todas las respuestas coinciden con OpenAPI, sin any | FacetsResponse=MetricsFacets, AlertEntry=MetricsAlert, CategoryEntry=TopCategoryItem, SummaryEntry=MetricsSummaryItem; arrays raíz correctos |
| 19 | Evaluación: DateRangeFilter opcional string + JSDoc YYYY-MM-DD | start_date?: string y end_date?: string documentados en param-types.ts |
| 20 | Evaluación: AlertsParams/TopCategoriesParams incluyen DateRangeFilter | Ambos extends DateRangeFilter, comprobado en los archivos |
| 21 | Evaluación: Cada componente con nombre, props tipadas y renderizado condicional | Secciones de componentes y tablas de props; loading/error/success/empty explícitos |
| 22 | Evaluación: Vacío de anomalías explícito | Sin anomalías para este umbral y rango de fechas; también sin datos e historia insuficiente, tabla siempre visible |
| 23 | Evaluación: Solo un input de fecha explícito | Solo inicio y solo fin, inclusivos y omitiendo el otro parámetro; reglas y casos en README/components |
| 24 | Evaluación: Vacío de top-5 en ambos paneles | Casos separados para B2B vacío, B2C vacío y ambos vacíos; no se inventan cinco filas |
| 25 | Evaluación: README cubre las tres funciones con ≥2 casos | 8 casos por función y respuesta prevista; contratos, restricciones y tipos por función |
| 26 | Evaluación: TypeScript compila | Comprobación normal más npx tsc --noEmit --project specs/tsconfig.json y tsconfig.app.json; ver verification.md |
| 27 | Evaluación: Rama y commits significativos, trabajo asistido verificado | feature/frontend-specs; tres commits de fase y commit posterior de auditoría; se distingue revisión del agente de revisión personal |
| 28 | Evaluación: Sin React, fetch ni cambios de backend | Diff frente a main limitado a documentación/tipos/configuración de specs y memoria; frontend/src y backend sin cambios |

## Requisitos funcionales detallados

| Funcionalidad | Elementos cubiertos |
|---|---|
| Fechas | Dos inputs superiores, ambos opcionales, YYYY-MM-DD, todo el dashboard afectado, rango min/max junto al control, sin fechas=todo, inicio solo/fin solo, rango inválido, error y vacío |
| Anomalías | Debajo de gráficos, cuatro columnas, media de 3 meses anteriores, ratio configurable [0.01,1.0] con default 0.3, incremento visible en %, respeta fechas, mensajes vacíos, carga/error, baseline cero e historia insuficiente |
| Comparativa | Página /comparison, B2B/B2C paralelos en escritorio y apilados en móvil, hasta 5 categorías, nombre/ingresos/% del grupo, un gráfico debajo, filtros de fecha, catálogo de facetas y totales completos por grupo |

## Desajustes reales que no deben ocultarse

1. /api/metrics/alerts no calcula la media de tres períodos: calcula todo el historial previo. El contrato real está tipado y verificado, y la especificación propone usar summary para obtener la serie completa y cumplir la media móvil pedida en la futura capa de transformación. No se alteró el backend ni se cambió el requisito del PM a una media histórica.
2. /api/metrics/facets no proporciona un catálogo separado por grupo. La spec usa su catálogo global y deriva la disponibilidad por grupo/rango de los movimientos de ingresos, en vez de inventar un campo o query.
3. El top no devuelve porcentajes ni totales de grupo. Son modelos de presentación derivados, documentados aparte del contrato de transporte.
4. AlertsResponse y TopCategoriesResponse son alias de arrays porque el JSON raíz es una lista. Convertirlos en interfaces con propiedades alerts/categories rompería el contrato real aunque el enunciado use la palabra interfaces de forma general.

Estas resoluciones responden al paso obligatorio de identificar discrepancias y resolverlas en la spec. Se explican al alumno para su defensa; no se presentan como decisiones del PM ya aprobadas.

## Revisión personal y envío

El agente comprobó los artefactos y las llamadas reales. El alumno debe poder explicar los desajustes anteriores y compartir la URL con su instructor. No se han marcado casillas en 4Geeks ni enviado mensajes en nombre del alumno. Los resultados técnicos se registran en verification.md.
