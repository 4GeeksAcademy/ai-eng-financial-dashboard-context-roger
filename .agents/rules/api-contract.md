# R1 — Mantener el contrato de movimientos

**Justificación:** Los mismos campos se mantienen en Python y TypeScript.

**Alcance:** rutas del backend, tipos y consumidores del frontend. **Evidencia:** H1, H6.

Antes de cambiar un movimiento, comparar FinancialMovement en backend/app/routes.py y frontend/src/lib/financial-types.ts. Mantener nombres, formatos de fecha y valores admitidos coordinados con el consumidor de App.tsx. Si una tarea cambia el contrato, actualizar los lados afectados y sus pruebas. No afirmar que TypeScript valida el JSON recibido.

**Aplicación:** leer antes de actuar dentro del alcance. Validación en docs/rules-validation.md.

**Refinamiento tras validación:** Para auditar el contrato actual con servicios activos, ejecutar python3 docs/check-api-contract.py desde la raíz. Esta comprobación no agrega validación JSON al navegador y no es un parser TypeScript general.
