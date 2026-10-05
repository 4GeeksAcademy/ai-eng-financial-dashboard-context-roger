# Especificación de componentes

Estado: especificación para implementación futura, 2026-10-05. No se crean componentes React ni consumidores HTTP en esta entrega. Los contratos de transporte están en api-types.ts y param-types.ts. Las reglas de producto que siguen son decisiones de esta especificación, no capacidades atribuidas a OpenAPI.

## Composición y convenciones

Seguir la estructura actual: App coordina obtención/estados, lib transforma datos, components/dashboard presenta, components/ui aloja controles reutilizables. Reutilizar KPIRow, IncomeOutcomeChart, ProfitPercentChart y DashboardHeader. Mantener moneda USD con formato en-US, dinero sin decimales en pantalla y porcentajes con un decimal. Los valores crudos conservan precisión; no redondear antes de comparar con un umbral.

Tipos de presentación definidos aquí (no respuestas de API):

- RequestStatus = 'idle' | 'loading' | 'success' | 'error'.
- DateRangeErrors = { start_date?: string; end_date?: string; range?: string }.
- RollingAlertRow = { period: string; outcome_total: number; baseline_three_periods: number; increase_ratio: number }. period es YYYY-MM; baseline_three_periods es la media móvil de exactamente tres meses, no baseline_average del endpoint alerts.
- CategoryRow = { category: Category; total_amount: number; share_percent: number }. share_percent es porcentaje 0..100 calculado localmente, no campo del JSON.
- BusinessTotal = { business_type: BusinessType; total_income: number }.

Los callbacks son firmas de props para una implementación posterior; no se implementan en los archivos TypeScript de esta entrega.

## 1. Dashboard y filtro de fechas

### DashboardPage (evolución de App)

Props: ninguna. Estado inicial: draft y applied de tipo DateRangeFilter con ambos campos omitidos; facets de tipo FacetsResponse | null; movimientos FinancialMovement[]; status de RequestStatus y error string | null por recurso. La propiedad period del encabezado se deriva de los movimientos filtrados con computeDataPeriod.

Obtiene facetas globales una vez al entrar y movimientos sin fechas. Renderiza DateRangeFilterControls encima del encabezado/indicadores, KPIRow y ambos gráficos actuales, y debajo OutcomeAlertsSection. El rango aplicado afecta movimientos, KPIs, gráficos, período y alertas en la misma actualización lógica. No mezclar resultados de rangos distintos; las respuestas antiguas no pueden reemplazar una solicitud posterior. Si un recurso falla, solo ese recurso muestra error y reintento, sin confundirlo con vacío.

### DateRangeFilterControls

| Prop | Tipo | Significado |
|---|---|---|
| value | DateRangeFilter | Fechas editadas; campo vacío se representa por propiedad omitida |
| availableRange | Pick<FacetsResponse, 'min_date' &#124; 'max_date'> &#124; null | Rango global de referencia, no filtrado |
| facetsStatus | RequestStatus | Estado de obtención de las facetas |
| facetsError | string &#124; null | Error de referencia |
| errors | DateRangeErrors | Mensajes de validación locales |
| disabled | boolean | Bloquea aplicación mientras se solicita un nuevo rango |
| onChange | (value: DateRangeFilter) => void | Actualiza borrador |
| onApply | (value: DateRangeFilter) => void | Aplica borrador válido |
| onReset | () => void | Vacía ambos campos y aplica todos los datos |
| onRetryFacets | () => void | Reintenta las facetas |

Dos inputs type=date etiquetados Inicio y Fin, botones Aplicar y Restablecer. Mostrar junto a ellos Disponible: min_date - max_date. Ambos son opcionales. Aplicar se habilita solo con fechas reales YYYY-MM-DD y start_date <= end_date cuando ambas existen. No convertir fechas de calendario a Date en zona local. Una fecha vacía nunca se envía como cadena vacía, null o undefined.

Solo inicio: desde esa fecha inclusive, sin límite superior. Solo fin: hasta esa fecha inclusive, sin límite inferior. Sin ambas: todos los datos. Igualdad: un solo día. El rango disponible informa; no impone límites min/max a los inputs, porque la API admite consultas fuera del dataset con resultado vacío. Rango invertido bloquea la solicitud y muestra Inicio debe ser anterior o igual a Fin. Error de formato junto al campo, asociado con aria-describedby y aria-invalid.

Facetas loading: Consultando rango disponible. Error: Rango disponible no disponible y Reintentar; permitir aún filtros válidos y movimientos, pero la tabla de media móvil espera las facetas para fijar su calendario. No inventar un rango si falta la referencia. Movimientos loading: reutilizar esqueletos de los componentes actuales. Error: No se pudieron cargar los datos financieros y reintento. Success con []: Sin movimientos para este rango; KPIs cero, gráficos con mensajes vacíos y encabezado sin período ficticio.

## 2. Alertas de anomalías

### OutcomeAlertsSection

Props: filter: DateRangeFilter; facets: FacetsResponse | null; facetsStatus: RequestStatus. Mantiene thresholdDraft: string (inicial '0.3'), thresholdApplied: number (inicial 0.3), summary: SummaryResponse, status: RequestStatus y error: string | null. Renderiza ThresholdControl y OutcomeAlertsTable bajo los gráficos existentes.

La tabla pide media móvil de tres períodos. El endpoint /api/metrics/alerts tiene media de TODO el historial y puede emitir una alerta con menos de tres períodos previos. No usar ni relabelar esa respuesta para la tabla solicitada. Contrato de ese endpoint documentado y tipado como AlertsResponse para trazabilidad; la fuente de producción prevista de esta tabla es /api/metrics/summary?group_by=month con el mismo filtro de fechas, sin operation_type ni business_type. No es un cambio de backend.

Transformación futura en lib: fijar calendario entre max(inicio aplicado o min_date, min_date) y min(fin aplicado o max_date, max_date), inclusivos. Si no hay intersección, rows=[] y sin datos. Crear meses YYYY-MM dentro de ese intervalo; usar outcome de summary, rellenar meses ausentes con 0. Los meses con ingresos y sin gastos también cuentan con outcome=0. Conservar los meses parciales de los límites con sus gastos filtrados. Para cada mes desde el cuarto, baseline = suma de los tres meses previos / 3, ratio = (outcome - baseline) / baseline; emitir solo si baseline > 0 y ratio > thresholdApplied. No usar historia fuera del rango seleccionado ni saltar meses sin movimientos. Si baseline=0, omitir el candidato sin mostrar Infinity o NaN. Las tres primeras filas del calendario no son candidatas. Orden de alertas: cronológico ascendente.

Si el período elegido tiene menos de cuatro meses, mostrar No hay suficientes períodos: se necesitan tres meses previos. Si hay suficiente historia pero ninguna alerta, Sin anomalías para este umbral y rango de fechas. Si no hay movimientos, Sin datos para analizar en este rango. Estos estados siempre mantienen título, control y estructura de tabla.

### ThresholdControl

Props: value: string; error: string | null; disabled: boolean; onChange: (value: string) => void; onApply: (value: number) => void.

Input numérico etiquetado Umbral de incremento (ratio), min=0.01, max=1, step=any y botón Aplicar umbral. Ayuda visible: 0.30 equivale a 30%. Validar número finito en [0.01,1.0], inclusive; step=any permite todos los ratios finitos dentro del rango, sin añadir una restricción de múltiplos. Vacío/NaN/fuera de rango: error y mantener umbral aplicado anterior. Un nuevo umbral válido recalcula filas localmente sobre el mismo summary; no dispara una consulta nueva si el rango no cambió. No multiplicar por 100 al enviar un ratio a la API de diagnóstico.

### OutcomeAlertsTable

Props: rows: RollingAlertRow[]; status: RequestStatus; error: string | null; emptyReason: 'no-data' | 'insufficient-history' | 'no-anomalies' | null; onRetry: () => void.

Cuatro columnas: Período (period), Gasto registrado (outcome_total), Media móvil de 3 períodos (baseline_three_periods), Incremento (increase_ratio * 100 con un decimal y %). Tabla semántica con caption Alertas de gasto, encabezados th y scope=col. Loading: fila Cargando alertas. Error: fila No se pudieron cargar las alertas y botón Reintentar; no presentar error como ausencia de anomalías. Success con filas: mostrar datos; success sin filas: mensaje según emptyReason en celda colspan=4. El estado loading invalida los datos anteriores para ese rango.

## 3. Comparativa B2B vs B2C

### BusinessComparisonPage

Props: ninguna. Ruta de producto /comparison con enlace Comparativa B2B/B2C en navegación y enlace Dashboard para volver a /. Esta navegación se implementará en una tarea posterior; no instalar un router en esta entrega. Su filtro local empieza vacío, persiste al cambiar de vista durante la sesión y es independiente del filtro del dashboard.

Carga FacetsResponse global, reutiliza DateRangeFilterControls y coordina dos paneles BusinessCategoryPanel y un único BusinessIncomeChart debajo. Por cada grupo solicita top con operation_type=income, limit=5, business_type explícito y las fechas aplicadas; también movimientos de /api/metrics/b2b o /api/metrics/b2c con operation_type=income y esas mismas fechas. El total del grupo es la suma de TODOS esos movimientos, calculada en centavos para evitar error binario, y NO la suma arbitraria del top-5. El gráfico y los porcentajes usan el mismo total. Un cambio de fechas renueva ambos grupos como una generación; no dibujar el gráfico con períodos diferentes.

Facetas no proporciona categorías por grupo y no acepta filtros. Obtener catálogo global de facets.categories; availableCategories del panel es la intersección de ese catálogo con las categorías presentes en los movimientos de ingresos del grupo y rango. Este es un conjunto derivado, no un campo del endpoint. No añadir un selector de categoría que el PM no pidió. Si una categoría de top no pertenece al catálogo o las respuestas de un grupo son incoherentes, mostrar error de contrato y reintento en ese panel, sin ocultar filas ni fabricar porcentajes.

### BusinessCategoryPanel

| Prop | Tipo | Significado |
|---|---|---|
| businessType | BusinessType | B2B o B2C |
| rows | CategoryRow[] | Top recibido con porcentaje derivado |
| availableCategories | Category[] | Categorías verificadas del grupo/rango dentro del catálogo de facetas |
| totalIncome | number &#124; null | Total de todos los ingresos; null si aún no disponible |
| status | RequestStatus | Estado conjunto de facetas, top y movimientos necesarios |
| error | string &#124; null | Error del grupo o del contrato |
| onRetry | () => void | Reintenta recursos de ese grupo |

Título visible B2B o B2C y total. Tabla con Categoría, Ingresos y % del total del grupo; filas en orden descendente de total_amount tal como la API. share_percent = total_amount / totalIncome * 100; si totalIncome=0, el valor defensivo es 0 y no se divide. No redondear antes del cálculo. No inventar cinco categorías: mostrar entre 0 y 5, sin rellenar filas ni porcentajes para categorías ausentes. En empates conservar el orden de la API.

Success con top=[] y movimientos=[]: Sin categorías de ingresos para B2B en este rango o equivalente B2C; total 0. Loading: tres columnas con fila Cargando categorías. Error: No se pudo cargar B2B/B2C y Reintentar; conservar el panel exitoso del otro grupo. Incoherencia top vacío con ingresos positivos: error de contrato, no estado vacío exitoso. Si facetas falla, ambos paneles muestran error de catálogo/reintento y el gráfico puede mostrar los totales si ambos movimientos se obtuvieron correctamente.

### BusinessIncomeChart

Props: totals: BusinessTotal[] (exactamente B2B y B2C cuando status=success); status: RequestStatus; error: string | null; onRetry: () => void.

Un gráfico de barras con categorías B2B y B2C, eje Y desde 0 en USD y tooltip de ingresos. Fuente: total de todos los movimientos de ingresos filtrados de cada grupo. Mantener ambos grupos aunque uno tenga 0. Ambos 0: Sin ingresos para comparar en este rango, sin gráfico engañoso. Loading: Cargando comparativa; error al obtener cualquiera de los dos totales: No se pudo completar la comparativa, sin convertir el total desconocido a cero. Añadir tabla o resumen textual accesible con ambos totales; no depender del color para distinguir grupos.

## Accesibilidad, concurrencia y aceptación

Controles accesibles por teclado con etiquetas visibles; mensajes de estado con aria-live=polite y errores accionables. En escritorio, paneles B2B/B2C en dos columnas; en móvil, apilados en orden B2B, B2C, gráfico. Tablas pueden desplazarse horizontalmente en su contenedor sin desbordar toda la página. Revisar estas vistas móvil/escritorio al implementar; aquí no existe nueva UI renderizada que probar.

Cualquier solicitud fuera de orden se ignora mediante cancelación o identificador de generación. Aplicar rango nuevo invalida resultados dependientes; reintentar conserva los filtros y el umbral. El estado vacío solo se usa después de una respuesta correcta. Referencias y casos de aceptación están en README.md y verification.md.
