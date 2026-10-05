# Verificación de las especificaciones — 2026-10-05

Verificación realizada por el agente en el Codespace; no se atribuye una revisión personal al alumno. Fuentes: Swagger /docs de la API activa, JSON /openapi.json y backend/app/routes.py. Se revisaron AGENTS.md, las cinco reglas .agents/rules, memory-bank y el consumidor frontend/src/App.tsx. .agents/skills no existe. Git empezó limpio en main...origin/main; se creó feature/frontend-specs. Docker Compose no tenía servicios activos y se arrancó con docker compose up --build -d; posteriormente ambos estaban Up y /health respondió 200 con status=ok.

## Matriz de afirmaciones

| Afirmación | Estado | Evidencia / corrección |
|---|---|---|
| Fechas start_date/end_date opcionales con format=date | ✅ Verificada | OpenAPI de metrics, alerts, top, summary y b2b/b2c |
| Límites de fecha inclusivos | ✅ Verificada | filter_movements_by_date y consultas de límite en vivo |
| Facetas por grupo | ❌ Incorrecta | MetricsFacets solo tiene categories global, sin parámetros; se deriva intersección con ingresos del grupo |
| AlertsResponse es objeto con alerts | ❌ Incorrecta | OpenAPI 200 array de MetricsAlert; alias TypeScript array |
| baseline_average es media de tres períodos | ❌ Incorrecta | detect_outcome_alerts acumula todos los anteriores; ejemplo marzo difiere de ventana de tres |
| API threshold está limitado a 0.01..1 | ❌ Incorrecta | OpenAPI minimum=0 sin maximum; 0 y 1.1 devolvieron 200. Es restricción de UI |
| top devuelve porcentaje y total de grupo | ❌ Incorrecta | TopCategoryItem solo category, operation_type, total_amount; derivados de movimientos de ingresos |
| top admite business_type y limit 1..20 | ✅ Verificada | OpenAPI, consultas B2B/B2C 200; limit=21 -> 422 |
| Cinco filas garantizadas | ❌ Incorrecta | limit es máximo; ambos grupos devolvieron dos categorías de ingresos |
| Fechas fuera del dataset producen error | ❌ Incorrecta | start_date=2099-01-01 -> 200 [] |
| Inicio > fin produce 422 | ❌ Incorrecta | Consulta invertida -> 200 []; la UI lo bloquea por decisión de spec |
| Media móvil local sobre summary respeta PM | ✅ Decisión de especificación | Regla explícita en components.md/README.md; no se implementó ni se atribuye al backend |

## Esquemas comprobados

Comparación automatizada contra OpenAPI activo: mismos nombres de propiedades, mismas propiedades requeridas y correspondencia string/number/enum/array para FacetsResponse=MetricsFacets, AlertEntry=MetricsAlert, CategoryEntry=TopCategoryItem y SummaryEntry=MetricsSummaryItem. Se verificaron respuestas raíz array de alerts, top y summary, y conjuntos de parámetros opcionales de MetricsParams, AlertsParams, TopCategoriesParams y SummaryParams. Enums compartidos se contrastaron con FinancialMovement y esquemas de respuestas.

Facetas observadas: min_date=2025-10-02, max_date=2026-09-28; operation_types income/outcome; business_types B2B/B2C; categories administrative, operational, others, sales, suppliers. Fechas dependen del dataset simulado, no son constantes de producto.

Consultas ejecutadas: /health; /openapi.json; /api/metrics/facets; alerts con threshold 0.3, 0, 1.1 y -1; top income/limit=5 para B2B y B2C; top limit=21; metrics fecha inválida, fuera de rango e invertida; summary mensual global y de ingresos B2B; movimientos b2b/b2c de ingresos. Respuestas inválidas: threshold=-1, limit=21 y start_date=invalid -> 422.

## Evidencia numérica

- API alerts threshold=0.3: diciembre, marzo, junio y agosto; baseline de marzo 56456.19 e increase_ratio=0.5601.
- Cálculo de auditoría sobre tres meses: marzo baseline 59977.58, ratio 0.468497...; junio baseline 60192.763333..., ratio 0.332585...; agosto baseline 60515.75, ratio 0.358148... . Diciembre no dispone de tres meses anteriores.
- Total de ingresos de TODOS los movimientos B2B: 615540.72; top sales 557903.97, others 57636.75.
- Total B2C: 642606.15; top sales 574193.41, others 68412.74.

El cálculo de auditoría es un contraste externo, no lógica implementada en la aplicación. Los importes no se codifican como constantes en las specs.

## Comprobaciones de tipos y alcance

Se ejecutó en frontend dentro de Docker: npx tsc --noEmit (exit 0), npx tsc --noEmit --project specs/tsconfig.json (exit 0, strict=true, incluye tipos de specs), npx tsc --noEmit --project tsconfig.app.json (exit 0). La configuración raíz por sí sola no incluye specs; por ello se añadió tsconfig.json dedicado en esta carpeta. git diff --check sin errores.

No se modificaron frontend/src ni backend, ni se agregaron dependencias. No se construyó UI nueva: no corresponde afirmar pruebas visuales móvil/escritorio de funcionalidades aún no implementadas. components.md fija su comportamiento responsive para implementación posterior.

## Reproducir la inspección

~~~bash
docker compose ps
curl --fail http://127.0.0.1:8000/health
curl --fail http://127.0.0.1:8000/openapi.json
curl --fail 'http://127.0.0.1:8000/api/metrics/facets'
curl --fail 'http://127.0.0.1:8000/api/metrics/alerts?threshold=0.3'
curl --fail 'http://127.0.0.1:8000/api/metrics/summary?group_by=month'
curl --fail 'http://127.0.0.1:8000/api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B'
curl --fail 'http://127.0.0.1:8000/api/metrics/b2b?operation_type=income'
docker compose exec -T frontend npx tsc --noEmit --project specs/tsconfig.json
~~~

Abrir puerto privado 8000 y /docs en Codespaces. Antes de entregar, el alumno debe revisar las decisiones de ventana, meses parciales y catálogo derivado para poder explicarlas al instructor.
