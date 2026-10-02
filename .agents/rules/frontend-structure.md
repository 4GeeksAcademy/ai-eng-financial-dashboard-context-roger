# R3 — Seguir la estructura existente

**Justificación:** La aplicación separa obtención de datos, transformaciones y presentación.

**Alcance:** frontend/src y configuración del alias @. **Evidencia:** H4.

Usar App para obtención de datos y estados, lib para transformaciones financieras, dashboard para presentación y ui para componentes reutilizables. Seguir los nombres existentes al crear un archivo. Si se cambia un alias, revisar Vite y TypeScript juntos. Evitar duplicar fórmulas dentro de componentes visuales.

**Aplicación:** leer antes de actuar dentro del alcance. Validación en docs/rules-validation.md.

**Refinamiento tras validación:** Para una etiqueta derivada de datos, seguir el ejemplo computeDataPeriod en lib: App obtiene el resultado y lo pasa como prop period a DashboardHeader. Cubrir el conjunto vacío sin inventar un período.
