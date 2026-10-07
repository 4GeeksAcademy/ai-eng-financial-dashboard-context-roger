---
name: financial-chart-integrity
description: Mantener coherencia entre gráficos, tablas y estados vacíos del dashboard financiero al modificar su presentación o sus cálculos mensuales.
---

# Integridad de gráficos financieros

## Objetivo

Que gráficos, alternativas accesibles y KPIs representen los mismos datos sin confundir cero con ausencia. Aplicar al modificar frontend/src/components/dashboard o las transformaciones financieras; no amplía el contrato ni añade funciones del backend a la pantalla.

## Entradas

- Cambio solicitado y componentes afectados.
- FinancialMovement y MonthlyDataPoint de frontend/src/lib/financial-types.ts.
- Transformaciones de financial-utils.ts y reglas .agents/rules/financial-dates.md y api-contract.md.

## Procedimiento

1. Seguir los datos desde /api/metrics en App hasta computeMonthlyData y las props del componente afectado. Las alternativas accesibles deben recibir esos mismos puntos, sin recalcular porcentajes en JSX.
2. Decidir ausencia por longitud del conjunto, nunca por truthiness ni por some(value !== 0). Ingresos igual a gastos es un margen legítimo de 0%; sin ingresos la convención actual también devuelve 0%.
3. Conservar meses por prefijo YYYY-MM, orden cronológico, moneda USD sin decimales y porcentajes con un decimal. Un margen negativo representa pérdida y debe seguir visible.
4. Verificar casos de equilibrio, pérdida, solo gastos, cero y conjunto vacío. Carga/error no deben presentarse como resultados financieros confirmados.
5. Comprobar las tablas y el estado visual con pruebas pertinentes y navegador; ejecutar las pruebas de fechas en UTC y America/Los_Angeles si cambian las transformaciones.

## Salidas y aceptación

- Diff limitado a la tarea y evidencia en docs/skills-validation.md o memory-bank/progress.md.
- Cero y pérdidas visibles; solo [] usa el estado sin datos.
- Tabla y gráfico consumen las mismas props y usan los formateadores de lib.
- Pruebas verificadas, límites explícitos y ausencia de fórmulas financieras duplicadas en presentación.
