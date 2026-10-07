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

El alumno leyó los documentos de contexto durante la sesión y después delegó la implementación. Las nuevas pruebas y el diff fueron revisados por el agente. El 2026-10-07 el alumno confirmó expresamente su revisión personal tras abrir las mejoras, las evidencias y la skill interna: «ya confirmo mi revision». Se registra su confirmación; no se atribuyen al alumno las pruebas ejecutadas por el agente ni modificaciones personales del archivo de skill que no se hayan realizado.

Estado de publicación al registrar esa confirmación: el remoto sigue en 4ef3ca4. La nota final de Codespaces (bb898f1) y esta actualización de revisión están pendientes de push tras errores internos de GitHub. La revisión personal ya está confirmada; compartir la URL del PR con el instructor sigue pendiente.

Entrega: [PR #1 contra main](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-roger/pull/1), abierto y sin merge. Codespaces recibió los commits por fast-forward y confirmó el push de feature/agent-skills. Docker Compose se reconstruyó y ambos servicios arrancaron. En sus contenedores pasaron lint/build y 14 pruebas frontend en UTC/America/Los_Angeles (exit 0), además de 15 pruebas backend; check-api-contract.py confirmó contrato/proxy y 360 movimientos. El puerto privado reenviado devuelve un error de forwarding en la autenticación del navegador; la UI se verificó en producción local y no se afirma haberla visto por ese túnel. No se amplía visibilidad ni se modifica el proxy por ese error. Compartir la URL del PR y revisar personalmente las mejoras corresponde al alumno.
