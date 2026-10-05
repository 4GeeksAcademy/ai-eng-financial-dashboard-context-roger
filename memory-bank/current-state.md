# Estado actual — 2026-10-02

## Trabajo verificado

| Fase | Resultado guardado | Evidencia |
|---|---|---|
| 1 | Entendimiento del proyecto, contraste del resumen y ajuste configurable del proxy | commit 7262457; [project-overview.md](../docs/project-overview.md) y [verification.md](../verification.md) |
| 2 | Hallazgos H1–H8 y propuestas R1–R5 vinculadas a ellos | commit cad7589; [engineering-findings.md](../docs/engineering-findings.md), [proposed-rules.md](../docs/proposed-rules.md) |
| 3 | Cinco reglas implementadas, tareas reales y refinamientos; correcciones mínimas de fechas y período | commit 2b7ff2a; [.agents/rules](../.agents/rules/), [rules-validation.md](../docs/rules-validation.md) |
| 4 | Memoria de producto, stack y estado actual contrastada con fuentes | esta carpeta; revisión registrada en verification.md |

Las reglas son api-contract, financial-dates, frontend-structure, setup-verification y evidence-delivery. Tienen alcance, justificación, instrucciones y refinamiento tras validación.

En fase 3 una prueba confirmó que convertir YYYY-MM-DD a Date y usar getters locales podía enviar el primer día al mes anterior. computeMonthlyData ahora usa el prefijo YYYY-MM. computeDataPeriod deriva el período real y App lo pasa al encabezado. Las fórmulas financieras y el contrato de movimientos se conservaron.

## Últimos resultados de aplicación (fase 3)

- Frontend: 9 pruebas correctas tanto en UTC como en America/Los_Angeles; build y lint correctos.
- Backend: 15 pruebas correctas, con una advertencia de deprecación del TestClient.
- /health correcto; contrato comparado con OpenAPI y tipos TypeScript; 360 movimientos compatibles mediante el proxy.
- API y navegador mostraron 2025-10-02 - 2026-09-28; KPIs: ingresos $1,258,147, gastos $762,132, beneficio $496,015 y margen 39.4%. Es una observación fechada, no un período permanente.
- Al iniciar fase 4, docker compose ps mostró ambos servicios activos y Git no mostró cambios pendientes antes de crear esta memoria.

Esta fase es documental: no se presenta como una nueva ejecución de las pruebas de aplicación.

## Límites conocidos

1. La ruta alternativa del proxy funciona en este entorno; la causa raíz del fallo original de red sigue desconocida. La configuración local puede necesitar revisión al recrear el entorno.
2. La compilación avisa de un bundle mayor de 500 kB (584.38 kB en la última ejecución). No impide compilar; no se realizó una refactorización general de rendimiento.
3. No hay validación JSON de movimientos en el navegador: el script de auditoría es una comprobación externa del contrato actual.
4. La inspección visual fue del agente. No equivale a una suite automatizada de extremo a extremo ni a revisión personal ya hecha por el alumno.
5. Los datos son simulados y relativos a la fecha de ejecución; no se debe confundir el backend disponible con funciones visibles en App.

## Prioridades de entrega

La fase 4 se conserva en el commit independiente que incorpora esta carpeta. Pendientes después de ese commit:

- Revisar con el alumno el resumen, los hallazgos, las reglas y esta memoria para que pueda explicar y corregir su contenido.
- Subir los commits al fork y comprobar que GitHub contiene los cuatro commits de fase y los artefactos.
- Entregar la URL del repositorio según 4Geeks. El push y la entrega no se dan por realizados en esta memoria.

No se propone una ampliación de funcionalidades. Si cambia el código, actualizar el estado con evidencia; mantener verification.md como historial de comprobaciones.

## Actualización — 2026-10-05: entrega de especificaciones frontend

La rama feature/frontend-specs añade contratos TypeScript verificados con OpenAPI activo, especificación de componentes y contrato de datos de filtro de fechas, anomalías y comparativa B2B/B2C. Fuentes y resultados en [frontend/specs/verification.md](../frontend/specs/verification.md); decisiones y casos de aceptación en [frontend/specs/README.md](../frontend/specs/README.md).

La aplicación no implementa estas tres capacidades todavía. El backend mantiene alertas con media histórica; la especificación futura preserva el requisito de tres meses mediante summary y un cálculo local documentado. Las facetas son globales y el catálogo por grupo se deriva de movimientos de ingresos. Los porcentajes y los totales tampoco son campos del top de categorías.

Comprobaciones actuales: servicios activos, health 200, esquemas y parámetros contrastados con OpenAPI, fechas inclusivas y límites individuales comprobados, compilación TypeScript de specs con strict=true y frontend src correcta. No se atribuyen nuevas pruebas visuales de funcionalidades sin implementar ni revisión personal al alumno. Consultar el historial Git de esta rama para los commits separados de tipos, componentes y contrato. La entrega al instructor sigue a cargo del alumno.
