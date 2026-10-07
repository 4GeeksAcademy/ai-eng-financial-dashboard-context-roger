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

Tab y Enter abrieron la primera tabla; árbol accesible mostró encabezado h2, disclosure expandido y tabla con meses/importes. Las verificaciones adicionales y la entrega se registran al finalizar. No se atribuyen estas pruebas del agente a la revisión personal del alumno.
