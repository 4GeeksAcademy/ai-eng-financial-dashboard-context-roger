# Proyecto de skills — 2026-10-07

## Contexto y descubrimiento

Base: `83314f8` de main, mismo repositorio del proyecto de contexto. Rama: `feature/agent-skills`. Frontend React/TypeScript/Vite/Tailwind/Recharts, API FastAPI. Se leyeron AGENTS.md, las cinco reglas y los tres documentos de memoria antes de editar.

Se ejecutaron `npx skills find accessibility`, `npx skills find vercel-react-best-practices`, `npx skills find testing` y `npx skills find performance`. Se eligieron e instalaron a nivel de proyecto con el CLI skills:

- `addyosmani/web-quality-skills@accessibility`: alternativas de gráficos, teclado, contraste y estados.
- `vercel-labs/agent-skills@vercel-react-best-practices`: rendimiento de React compatible con Vite.
- `anthropics/skills@webapp-testing`: necesidad distinta, verificar interfaz renderizada, interacción, estados y consola. No añade otra guía de diseño.

Las fuentes y hashes están en `skills-lock.json`. Se cargaron los tres SKILL.md y las reglas Vercel `bundle-dynamic-imports`, `js-combine-iterations` y `js-min-max-loop`. Las instrucciones de documentos externos se usaron como guía técnica dentro del encargo.

## Auditoría inicial y cambios de accesibilidad

La inspección del DOM y del árbol accesible antes de editar mostró solo el h1 de la página; los títulos de gráficos eran div y no había tablas para consultar sus valores. App no anunciaba carga ni error. La revisión de ProfitPercentChart encontró que `some(profitPercent !== 0)` confundía cero con ausencia de datos.

| Instrucción de accessibility | Archivo y cambio |
|---|---|
| Text alternatives / imágenes complejas | chart-data-table.tsx: detalles nativos con tablas, caption y scope; mismos puntos mensuales que el gráfico. SVG redundante oculto a lectores, accessibilityLayer desactivado para evitar foco oculto. No hay imágenes de contenido que necesiten atributo alt. |
| Heading structure / elementos nativos | ui/card.tsx: CardTitle usa h2; summary funciona con Enter/Space sin handlers artificiales. |
| Focus visible / target size | index.css: contorno de 2px con currentColor; summary mide al menos 44px de alto; tabla desplazable recibe foco y nombre. |
| Contrast / no depender solo del color | Texto secundario oscuro aumentado de L=.62 a .72; serie de gastos discontinua, nombres y tablas disponibles. |
| Language / live regions / errors | App.tsx: role=status, aria-busy, role=alert y lang=es para el error existente; iconos decorativos aria-hidden. |
| Motion | Skeleton respeta reduced-motion; curvas sin animación de entrada. |

Verificación inicial tras estos cambios: axe-core sin violaciones detectadas (28 comprobaciones aprobadas, contraste incompleto). Se completó la comprobación de contraste mediante conversión de colores OKLCH renderizados a sRGB en canvas y luminancia: texto secundario/card 7.57:1, texto principal/card 15.84:1, curvas/card 5.11:1, 6.05:1 y 6.38:1. Foco usa el color principal. Son mediciones de este tema oscuro, no una certificación global.

## Aplicación de vercel-react-best-practices

- `bundle-dynamic-imports`: App carga financial-charts.tsx mediante React.lazy/Suspense, equivalente compatible con Vite de la recomendación de diferir componentes pesados. Recharts se descarga después de recibir datos; no se carga si la API falla. ChartLoading conserva encabezados y espacio del gráfico y del disclosure; las tarjetas KPI reservan altura. Esta división reduce carga inicial, no promete una reducción del total descargado ni una mejora de LCP medida.
- `js-combine-iterations`: computeKPIs suma ambos tipos en un recorrido sin arrays intermedios. `js-min-max-loop`: computeDataPeriod calcula extremos en un recorrido sin ordenar todos los movimientos. CurrencyFormatter reutiliza Intl.NumberFormat. Se mantienen fórmulas, formato y fechas de calendario.
- App cancela el fetch al desmontarse, evitando que una petición cancelada anuncie un error. index.html incorpora título específico, descripción y color-scheme coherente con el dashboard.
- No se añadieron next/image, next/font ni dependencias Next: no hay fotos de contenido, fuentes remotas ni Next.js en el stack. No se despliega a Vercel ni se cambia proveedor.

Medición comparable: se extrajo el frontend de main `83314f8` a un directorio temporal y se compiló usando los mismos node_modules que la versión modificada (Vite 8.3.3). Baseline: JS único 632.79 kB / gzip 188.20 kB y aviso >500 kB. Modificado: entrada 261.32 kB / gzip 82.28 kB y gráficos diferidos 375.41 kB / gzip 107.85 kB; ningún chunk supera 500 kB. El valor histórico 584.38 kB corresponde a otra resolución de dependencias y no se usa como comparación directa. La advertencia heredada sobre __dirname en Vite se corrige usando import.meta.dirname, compatible con Node 24 del proyecto.

Pruebas financieras existentes: 9 correctas en UTC y America/Los_Angeles después de optimizar; lint y build correctos. Las verificaciones finales incluyen los nuevos casos de presentación.

## Skill interna creada, cargada y aplicada

Se usó skill-creator para redactar `.skills/financial-chart-integrity/SKILL.md`, con objetivo, entradas, procedimiento y aceptación específicos del repositorio. AGENTS.md incorpora su ubicación para descubrimiento. Se volvió a leer el archivo antes de aplicarlo; quick_validate.py devuelve `Skill is valid!`.

Tarea real: ambos componentes chart decidían si había datos comparando valores con cero. Siguiendo el paso 2 de la skill, ahora la decisión usa `data.length > 0`. Se verifica en financial-charts.test.tsx el equilibrio (100 ingresos/100 gastos), movimientos cero, pérdidas, solo gastos, vacío y carga. Las tablas reciben exactamente las mismas props que las curvas y usan los formateadores de lib.

Frontend: 14 pruebas aprobadas en UTC y America/Los_Angeles, lint correcto y build sin advertencias. Build final local: entrada 261.32 kB/gzip 82.29 kB; gráficos 375.37 kB/gzip 107.83 kB. Backend: 15 pruebas aprobadas, con la deprecación heredada de TestClient/httpx. No se cambian dependencias ni backend para ocultarla.

## Skill adicional: webapp-testing

Se aplicó su flujo reconnaissance-then-action: esperar la interfaz, inspeccionar DOM/árbol accesible, localizar controles por texto/rol, ejecutar interacción y comprobar estado, capturas y consola. El navegador se controló con las APIs Playwright/CDP de CUA disponibles en esta sesión, en lugar de Python Playwright, para respetar la restricción de herramientas del entorno. No se afirma que se haya creado una suite Python de extremo a extremo. Las pruebas Vitest anteriores cubren la regresión financiera; estas comprobaciones cubren la interfaz renderizada.

Se probó la compilación de producción con `npm run preview -- --host 127.0.0.1 --port 4173` y proxy local a Uvicorn. Esta alternativa es solo para el host Windows de verificación; el setup de Codespaces sigue siendo Docker Compose y no se cambia su .env.local ni su destino de proxy.

| Escenario ejecutado | Resultado observado |
|---|---|
| Datos reales | 12 meses en ambas tablas, importes y porcentajes disponibles, sin errores/warnings de consola antes de simular fallos. |
| Teclado | Enter abre primera tabla; Tab pasa por su región y llega al segundo summary; Space abre segunda; foco visible y sin controles enfocados dentro de SVG oculto. |
| Móvil 390 y 320 CSS px | Sin desbordamiento horizontal de la página; tablas caben en 223px a 320px; summary mide 44px de alto. |
| Alto contraste | forced-colors emulado: textos, controles y contorno de foco siguen visibles. No equivale a prueba con Windows High Contrast real. |
| API lenta | Intercepción temporal de /api/metrics: status de carga, ambas secciones busy=true, 20 skeletons, sin gráficos confirmados. |
| Reduced motion | Preferencia emulada mientras carga: animation-name de skeleton = none. |
| API vacía [] | Período No financial data, dos mensajes sin datos y ninguna tabla. |
| API 503 | Error en role=alert/lang=es, KPIs con guion y aviso de gráficos no disponibles. El fallo de red simulado es esperado. |
| Equilibrio 100/100 | Beneficio $0, margen 0.0%, tabla Jan 2026/0.0%, sin mensaje de ausencia. |
| Reauditoría | axe-core sin violaciones detectadas, 28 comprobaciones aprobadas; contraste marcado incompleto se complementa con las mediciones anteriores. |

Las respuestas simuladas, estilos de emulación e inyección temporal de axe se restauran mediante limpieza de intercepción y recarga; no modifican datos del backend. Capturas de escritorio/móvil guardadas fuera del repositorio. No se ejecutó NVDA ni se confirmó zoom real de navegador al 200%; no se afirma conformidad WCAG completa. Estos límites no se convierten en funcionalidades o cambios fuera del proyecto.

Para repetir el flujo: iniciar servicios documentados, abrir el dashboard, usar Tab/Enter/Space para ambas tablas y revisar móvil; usar el inspector de red para simular carga/503/[] y una respuesta de equilibrio, restaurando la API al terminar. Contrastar columnas con las props MonthlyDataPoint y los KPIs con computeKPIs. Ejecutar lint/build/test antes de guardar la entrega.

## Correspondencia con la evaluación

| Criterio del proyecto | Evidencia de esta entrega |
|---|---|
| Dos skills asignadas cargadas/aplicadas | SKILL.md instalados, tabla de instrucciones/archivos y commits bd95217 / c792939. |
| Accesibilidad básica verificada | Árbol accesible, teclado, tablas/caption/scope, role/status/alert, contrastes medidos y chequeo de iconos decorativos. No hay img de contenido. |
| Build documentado sin nuevas advertencias | npm run build; tamaños medidos y advertencia heredada corregida. |
| Skill adicional descubierta/aplicada | find testing/performance; webapp-testing con justificación y escenarios anteriores. |
| Skill interna específica en .skills | financial-chart-integrity, estructura completa, cargada y aplicada a cero/ausencia; commit 566287f. |
| Memory bank preciso | progress.md y actualización fechada de current-state.md. |
| Rama/commits claros | feature/agent-skills, commits por aplicación y evidencia. |
| Mejora dirigida y revisada | Se conserva diseño, contrato, fórmulas y stack; diff y pruebas revisados por el agente. La revisión personal del alumno se mantiene como paso de aprendizaje pendiente. |

La entrega pide PR contra main. La URL y la comprobación de Codespaces se incorporan tras realizar esos pasos; no se envían mensajes al instructor ni se hace merge como parte de este proyecto.

Tab y Enter abrieron la primera tabla; árbol accesible mostró encabezado h2, disclosure expandido y tabla con meses/importes. Las verificaciones adicionales y la entrega se registran al finalizar. No se atribuyen estas pruebas del agente a la revisión personal del alumno.
