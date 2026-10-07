# Progreso — proyecto de skills — 2026-10-07

Base main 83314f8; rama feature/agent-skills; mismo dashboard heredado. Enunciado leído completo, incluidos los ocho criterios y la entrega por PR.

## Skills y resultados

- accessibility: tablas consultables con teclado/lector, h2 para títulos, estados anunciados, idioma del error, contraste secundario, foco visible, iconos decorativos y reduced-motion. Archivo/instrucción/evidencia en [skills-validation](../docs/skills-validation.md).
- vercel-react-best-practices: gráficos diferidos con React.lazy/Suspense, espacio reservado, metadatos, KPI y extremos de fecha en un recorrido. Entrada JS 632.79 → 261.32 kB usando las mismas dependencias; se elimina aviso de chunk >500 kB. No se mide LCP ni se migra a Next.
- webapp-testing: descubierta con find testing tras explorar también performance. Se eligió porque el repositorio tenía pruebas de cálculos, pero faltaba comprobar interacción, estados y alternativas accesibles en la interfaz. Aplicada mediante CUA Playwright/CDP: escritorio, móvil 320/390, teclado, API lenta/vacía/503/equilibrio y consola. No añade dependencias de producto.
- financial-chart-integrity: [skill interna](../.skills/financial-chart-integrity/SKILL.md), redactada con skill-creator, validada y cargada. Gap concreto: 0% se confundía con ausencia. Ahora [] decide el estado vacío; cero/pérdidas siguen disponibles, con pruebas de regresión.

## Verificado en el host Windows del agente

- npm run lint y npm run build correctos, sin avisos de build.
- 14 pruebas frontend en UTC y America/Los_Angeles; 15 backend, una deprecación heredada de TestClient/httpx.
- axe: cero violaciones detectadas; contraste incompleto complementado por medición sRGB (texto secundario/card 7.57:1; curvas/card >5:1).
- No se cambiaron fórmulas, contrato, dependencias versionadas, proveedor ni .env.local. La API no incorpora validación JSON en el navegador.
- Simulaciones de red y preferencias del navegador restauradas. Pruebas reales con NVDA y zoom real 200% no realizadas. No se presenta como certificación WCAG.

## Qué aprender de esta entrega

Una skill debe cambiar decisiones reales, no quedarse instalada. Las propuestas se contrastan con archivos y stack: next/image y next/font no corresponden a este Vite. Una alternativa accesible debe mostrar los mismos datos, y cero no significa ausencia. La mejora de rendimiento se compara con las mismas dependencias; separar un bundle reduce la entrada inicial pero no necesariamente el total descargado.

El alumno leyó los documentos de contexto durante la sesión y después delegó la implementación. Las nuevas pruebas y el diff fueron revisados por el agente; falta que el alumno revise personalmente las mejoras y refine/defienda la skill interna. No se atribuye esa revisión como realizada.

La sincronización de Codespaces y la URL del PR se registrarán tras completarlas. El PR queda abierto contra main; compartir su URL con el instructor corresponde a la entrega del alumno.
