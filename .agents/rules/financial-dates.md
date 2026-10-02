# R2 — Comprobar cálculos y períodos

**Justificación:** Los cálculos y fechas afectan a los indicadores y al mes mostrado.

**Alcance:** financial-utils.ts, sus pruebas y etiquetas de período. **Evidencia:** H2, H3, H6.

Mantener los cálculos en lib, conservar beneficio = ingresos - gastos y porcentaje = beneficio / ingresos * 100 con 0 cuando no hay ingresos. Al modificar agrupación, comprobar cambio de año y límites de mes. No cambiar moneda o redondeo sin una necesidad de la tarea. Para fechas ISO sin hora, comprobar explícitamente el efecto de la zona horaria antes de afirmar que el mes es correcto.

**Aplicación:** leer antes de actuar dentro del alcance. Validación en docs/rules-validation.md.

**Refinamiento tras validación:** Las fechas create_date del contrato son fechas de calendario ISO YYYY-MM-DD. Para agruparlas, usar su prefijo YYYY-MM (create_date.slice(0, 7)) sin conversión a hora local. Al cambiar agrupación, comprobar primer día del mes y cambio de año en UTC y America/Los_Angeles.
