# Producto

## Propósito y comportamiento

La aplicación presenta una vista financiera ejecutiva de movimientos simulados: ingresos totales, gastos totales, beneficio y margen de beneficio, junto a gráficos mensuales de ingresos/gastos y margen. Evidencia: [App.tsx](../frontend/src/App.tsx), [kpi-row.tsx](../frontend/src/components/dashboard/kpi-row.tsx), [income-outcome-chart.tsx](../frontend/src/components/dashboard/income-outcome-chart.tsx) y [profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx).

El navegador obtiene los movimientos de /api/metrics. El backend genera datos con semilla 42 y fechas relativas a date.today(); no representan información financiera de una empresa real. El archivo mock-data.ts del frontend no es la fuente activa de App. Evidencia: fetchFinancialData en App.tsx y generate_mock_movements/get_metrics en [routes.py](../backend/app/routes.py).

Cada movimiento contiene create_date (fecha ISO de calendario), amount, operation_type (income/outcome), category y business_type (B2B/B2C). El contrato está definido en routes.py y [financial-types.ts](../frontend/src/lib/financial-types.ts).

## Significado de los indicadores

[financial-utils.ts](../frontend/src/lib/financial-utils.ts) calcula beneficio = ingresos - gastos. El margen es beneficio / ingresos * 100; sin ingresos devuelve 0. Los movimientos se agrupan por año y mes. La moneda mostrada actualmente es USD, formato en-US y sin decimales monetarios; los porcentajes muestran un decimal.

El encabezado muestra las fechas mínima y máxima de los datos recibidos, una fecha única o un mensaje sin datos. Ya no afirma un año completo fijo. Evidencia: computeDataPeriod y su uso en App.

## Alcance implementado y límites

La pantalla usa /api/metrics. El backend también dispone de rutas para facets, summary, top, comparison, alerts, B2B y B2C; su presencia no significa que App las presente. Ver decoradores de rutas en routes.py y llamadas de App.tsx.

En el código inspeccionado no se implementan persistencia en base de datos ni autenticación de usuarios de la aplicación. El acceso privado al puerto de Codespaces pertenece al entorno de desarrollo. App incluye estados de carga y error. No se inventan funcionalidades, usuarios definidos por requisitos inexistentes ni una hoja de ruta de producto para esta entrega.
