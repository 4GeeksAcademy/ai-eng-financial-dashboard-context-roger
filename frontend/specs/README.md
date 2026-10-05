# Contrato de datos: especificaciones del dashboard financiero

Entrega de desarrollo guiado por especificaciones, rama feature/frontend-specs. Fecha de verificación: 2026-10-05. Alcance: contratos TypeScript, componentes documentados y decisiones de comportamiento. No hay implementación React, fetch, router nuevo ni cambios de backend.

## Cómo usar esta entrega

1. Leer AGENTS.md, .agents/rules y memory-bank antes de implementar.
2. Leer api-types.ts (respuestas), param-types.ts (query), components.md (props/estados) y verification.md (evidencia).
3. Confirmar el contrato de la API activa en /docs y /openapi.json; los datos son simulados y sus fechas dependen del día de ejecución.
4. Implementar en una tarea posterior siguiendo las decisiones de producto de este documento. No confundir esas decisiones con garantías de la API.

Reutilizamos OperationType, Category, BusinessType y FinancialMovement de ../src/lib/financial-types.ts, contrastados con FinancialMovement de OpenAPI. FinancialMovement incluye create_date: string YYYY-MM-DD, amount: number, operation_type: income/outcome, category: suppliers/sales/operational/administrative/others y business_type: B2B/B2C; todos obligatorios.

## API común y transporte

GET /api/metrics/facets no tiene parámetros declarados y devuelve FacetsResponse: operation_types, business_types, categories, min_date y max_date. Las listas describen el dataset global; no hay mapa categories_by_business_type ni facetas filtradas. min_date/max_date son fechas obligatorias, no null. El backend actual genera datos no vacíos; un error de facetas se presenta como error, no se fabrica un rango vacío.

DateRangeFilter contiene start_date?: string y end_date?: string. Serializar solo propiedades presentes y no vacías como query YYYY-MM-DD. Fechas inclusivas. No mandar cadenas 'null', 'undefined' ni vacías. OpenAPI admite ausencia/null en el modelo del servidor; el cliente expresa ausencia omitiendo el parámetro. TypeScript no garantiza que un string sea una fecha real: la futura UI valida calendario y formato.

En el consumidor futuro conservar API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '' y el proxy /api, tal como App.tsx; no hardcodear la URL del Codespace. Revisar response.ok antes de consumir el JSON. Error 422 es validación, no una respuesta vacía. Error de red/5xx muestra mensaje y reintento. Ignorar respuestas de generaciones anteriores. No cambiar moneda, fórmulas existentes ni fechas mediante conversiones de zona horaria.

## Funcionalidad 1: filtro global del dashboard

Outcome: Inicio y Fin opcionales encima del dashboard, referencia del rango disponible, todos los indicadores/gráficos y alertas respetan el rango aplicado.

| Petición | Tipo de parámetros | Respuesta |
|---|---|---|
| GET /api/metrics/facets | Ninguno | FacetsResponse (objeto) |
| GET /api/metrics | MetricsParams, incluye DateRangeFilter | FinancialMovement[] (array cronológico) |

Además de fechas, metrics admite category y operation_type opcionales con los enums anteriores. La UI de esta entrega no añade esos controles y omite ambos para conservar todos los movimientos. /api/metrics NO declara business_type: no inventar ese filtro.

Decisiones: aplicar mediante botón Aplicar; borrar mediante Restablecer. El borrador no modifica resultados hasta aplicar. start_date <= end_date si ambos existen; rango invertido se rechaza en UI, aunque la API observada responde 200 con []. El rango de facetas es referencia, no una prohibición de consultar fechas exteriores. Los KPIs se derivan de movimientos filtrados con computeKPIs; gráficos con computeMonthlyData y encabezado con computeDataPeriod.

Casos de aceptación:

| Caso | Query/datos | Resultado previsto de UI |
|---|---|---|
| Ambas vacías | /api/metrics | Todos los movimientos; referencia global visible |
| Solo inicio | ?start_date=2026-03-01 | Movimientos desde ese día inclusive; fin omitido |
| Solo fin | ?end_date=2026-03-31 | Movimientos hasta ese día inclusive; inicio omitido |
| Mismo día | inicio=fin | Solo ese día; cero movimientos si no hay datos |
| Inicio posterior a fin | Borrador inválido | Mensaje local, no petición nueva; mantener rango aplicado |
| Rango sin intersección | ?start_date=2099-01-01 | Respuesta real 200 []; Sin movimientos para este rango, KPIs 0, gráficos vacíos |
| Fecha malformada | API observada ?start_date=invalid -> 422 | UI bloquea formato inválido; si llega 422, error accionable |
| Facetas falla | Error HTTP/red | Referencia no disponible/reintento; datos y filtros válidos siguen utilizables |

## Funcionalidad 2: tabla de anomalías

Outcome: cuatro columnas (período, gasto registrado, media móvil de los tres períodos anteriores, incremento), umbral configurable como ratio y estado vacío explícito. En esta especificación período = mes calendario; ambos grupos combinados.

| Petición | Tipo de parámetros | Respuesta / uso |
|---|---|---|
| GET /api/metrics/alerts | AlertsParams | AlertsResponse = AlertEntry[]; contrato real para diagnóstico, NO media móvil de tres |
| GET /api/metrics/summary | SummaryParams (group_by=month, fechas aplicadas) | SummaryResponse = SummaryEntry[]; fuente prevista de la tabla de tres meses |
| GET /api/metrics/facets | Ninguno | FacetsResponse; límites del calendario analizable |

alerts: threshold opcional, default 0.3, mínimo API 0 y sin máximo; group_by opcional day/week/month, default month; fechas opcionales; business_type opcional B2B/B2C. No acepta operation_type. Todos estos parámetros están verificados. AlertEntry tiene period, outcome_total, baseline_average e increase_ratio, sin envoltorio alerts. El ratio 0.3 equivale a 30%, no 0.3%.

summary: group_by, start_date, end_date, category, operation_type y business_type opcionales. La tabla usa group_by=month y el rango, omite el resto para obtener ambos grupos y meses con movimientos de cualquiera de las dos operaciones. SummaryEntry contiene period, income, outcome, net; no trae una media móvil precalculada.

### Diferencia de contrato resuelta

Hecho verificado: detect_outcome_alerts en backend/app/routes.py utiliza la media de TODOS los períodos previos de la serie filtrada, no una ventana de tres. También admite candidatos desde el segundo período. No basta con renombrar baseline_average ni reconstruir una ventana desde la respuesta alerts, porque esa respuesta omite períodos sin alerta.

Decisión de especificación: preservar el requisito del PM calculando en la futura capa lib una media móvil de tres meses a partir de summary completo. No se implementa ese cálculo en esta entrega. Si otro equipo decide consumir exclusivamente alerts, tendrá que aceptar explícitamente cambiar el requisito; esta spec no presenta ese cambio como aprobado.

Calendario y fórmula: recortar rango aplicado al intervalo global de facetas; crear cada mes dentro de esa intersección y rellenar ausentes con outcome=0. Los primeros tres meses no se evalúan. Cada mes posterior usa exactamente sus tres meses anteriores, incluyendo meses con gasto cero; ningún historial exterior al rango elegido. Los meses de los extremos pueden estar incompletos y se calcula con esos importes parciales (decisión explícita). baseline_three_periods = suma / 3; increase_ratio = (outcome - baseline) / baseline; solo emitir cuando baseline > 0 e increase_ratio > threshold. Comparar sin redondear; dinero visible sin decimales y ratio * 100 con un decimal. Orden ascendente de períodos.

Restricción de UI: threshold finito entre 0.01 y 1.0, extremos incluidos, inicial 0.3. El backend admite 0 y 1.1, pero el control del producto los rechaza. Cambiar el umbral recalcula localmente; cambiar fechas consulta summary de nuevo.

Casos de aceptación:

| Caso | Condición | Resultado previsto |
|---|---|---|
| Sin anomalías | Historia suficiente, ninguna ratio > umbral | Sin anomalías para este umbral y rango de fechas; tabla/control visibles |
| Historia corta | Menos de 4 meses dentro del rango | No hay suficientes períodos: se necesitan tres meses previos |
| Sin movimientos | summary=[] | Sin datos para analizar en este rango |
| Media cero | Tres meses anteriores outcome=0 | Omitir candidato; nunca NaN/Infinity |
| Exactamente umbral | ratio=0.3, threshold=0.3 | No alerta: comparación estricta > |
| Input inválido | Vacío, no finito, 0 o 1.1 | Error local, conservar último umbral aplicado |
| Filtro de fecha activo | Meses parciales/interiores vacíos | Mismo rango del dashboard; ventana definida sobre su calendario filtrado |
| Error HTTP/red | summary no disponible | Error/reintento; no anunciar ausencia de anomalías |

Ejemplo calculado en auditoría el 2026-10-05: para marzo 2026, los gastos de diciembre/enero/febrero son 103378.98, 51690.68 y 24863.08; media de tres = 59977.58, ratio ≈ 0.468497. El endpoint alerts devuelve baseline_average=56456.19 y ratio=0.5601 para marzo, prueba de que sus significados son distintos. El conjunto histórico devuelve cuatro alertas con umbral 0.3; el cálculo de tres meses sobre la serie observada produce marzo, junio y agosto.

## Funcionalidad 3: comparativa B2B/B2C

Outcome: nueva página /comparison, dos paneles con hasta cinco categorías de ingresos, total y porcentaje del grupo, y un único gráfico de ingresos totales. Filtro local independiente del dashboard, con las mismas reglas de fechas.

| Petición | Tipo de parámetros | Respuesta / uso |
|---|---|---|
| GET /api/metrics/facets | Ninguno | FacetsResponse; catálogo global y referencia de fechas |
| GET /api/metrics/categories/top | TopCategoriesParams | TopCategoriesResponse = CategoryEntry[] por grupo |
| GET /api/metrics/b2b | MetricsParams, operation_type=income | FinancialMovement[]; total y categorías reales B2B |
| GET /api/metrics/b2c | MetricsParams, operation_type=income | FinancialMovement[]; total y categorías reales B2C |

Para top, enviar operation_type=income explícitamente (default API es outcome), limit=5 (entero; API 1..20), business_type=B2B o B2C y fechas aplicadas. No hay parámetro category en top. CategoryEntry contiene category, operation_type y total_amount; NO percentage, business_type ni group_total. Puede devolver menos de cinco filas y conserva orden descendente.

Movimientos de cada grupo: suma decimal de amount de TODOS los ingresos filtrados (convertir a centavos, sumar enteros y dividir por 100). Esa suma es totalIncome, denominador de share_percent y valor del gráfico; no sumar solo el top. share_percent = total_amount / totalIncome * 100, o 0 como protección si totalIncome=0. El gráfico nunca usa net ni /api/metrics/comparison: ese endpoint compara beneficio entre períodos, no ingresos B2B frente a B2C.

Facetas aporta el catálogo global. El conjunto de categorías disponibles por grupo/rango se deriva intersectando facets.categories con categorías de sus movimientos de ingresos. No inventar una respuesta agrupada ni enviar business_type a facets. No crear un selector de categoría adicional. Ambos grupos deben pertenecer a la misma generación de fechas; impedir mezclas al cambiar el rango.

Casos de aceptación:

| Caso | Condición | Resultado previsto |
|---|---|---|
| Menos de 5 categorías | API devuelve 2 | Mostrar 2, sin rellenar categorías ficticias |
| B2B vacío | Top y movimientos B2B=[] | Mensaje B2B explícito, total 0; conservar panel B2C |
| B2C vacío | Top y movimientos B2C=[] | Mensaje B2C explícito, total 0; conservar panel B2B |
| Ambos vacíos | Todos los ingresos=[] | Dos paneles vacíos y Sin ingresos para comparar en este rango |
| Solo un límite de fecha | Fecha inicial o final omitida | Mismo filtro inclusivo para top y movimientos de ambos grupos |
| Un grupo falla | Error de top o movimientos | Panel con error/reintento; gráfico solo disponible si ambos totales son conocidos |
| Contrato incoherente | Top desconocido en facetas o top vacío con total > 0 | Error de contrato; no fabricar una categoría o porcentaje |
| Ingresos totales cero | Denominador=0 | No dividir ni mostrar NaN; grupo con total cero |

Ejemplos reales sin filtro: B2B total 615540.72, sales 557903.97 y others 57636.75; B2C total 642606.15, sales 574193.41 y others 68412.74. Son observaciones fechadas, no constantes que deban codificarse. El porcentaje se deriva; su suma puede verse ligeramente distinta de 100% por redondeo visual.

## Verificación y entrega

Comandos desde la raíz del Codespace (dependencias ya instaladas en el contenedor):

~~~bash
docker compose exec -T frontend npx tsc --noEmit
docker compose exec -T frontend npx tsc --noEmit --project specs/tsconfig.json
docker compose exec -T frontend npx tsc --noEmit --project tsconfig.app.json
git diff --check
~~~

El primer comando cumple la comprobación solicitada pero tsconfig.json raíz tiene referencias y files=[]; no verifica por sí solo estas specs. specs/tsconfig.json incluye *.ts y strict=true, y el tercer comando verifica src. La comprobación estricta y la comparación de campos con OpenAPI se ejecutaron antes de guardar los tipos; ver verification.md.

Entregar la rama feature/frontend-specs subida al mismo fork, con commits separados para tipos, componentes y contrato. Los archivos de esta carpeta son el entregable. No presentar las funcionalidades como implementadas ni la revisión del agente como revisión personal del alumno. La explicación al alumno precede su entrega al instructor; no se envía ningún mensaje al instructor desde esta tarea.
