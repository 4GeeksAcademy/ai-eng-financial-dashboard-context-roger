# Rastro de verificacion

## Fase 1 - 2026-10-01

| Afirmacion | Estado | Evidencia / correccion |
| --- | --- | --- |
| El frontend usa React y TypeScript; el backend usa FastAPI. | ✅ Verificada | frontend/package.json, frontend/src/main.tsx, backend/requirements.txt, backend/app/main.py. |
| Compose declara dos servicios y publica 5173, 8000 y 5678. | ✅ Verificada | docker-compose.yml y los Dockerfiles. 5678 corresponde a debugpy, no a otro servicio de producto. |
| La fuente activa es el mock-data.ts del frontend. | ❌ Incorrecta si se infiere por el nombre del archivo | App.tsx hace fetch de /api/metrics; la API genera los movimientos en routes.py. |
| La etiqueta 2024 demuestra que los datos corresponden a 2024. | ❌ Incorrecta | La etiqueta es fija en App.tsx; routes.py utiliza date.today(). El navegador muestra meses de 2025 y 2026. |
| Contenedores arrancados y pruebas correctas garantizan la integracion. | ❌ Incorrecta | Se reprodujo timeout de 10 segundos en 5173/api/metrics pese a que /health respondia directamente. |
| El fallo era de resolucion DNS. | ❌ Descartada | backend resolvio a 172.18.0.2; la peticion HTTP agotaba el tiempo. |
| La causa exacta de la conectividad entre contenedores esta identificada. | ❓ Sin verificar | No se ha establecido la causa de red. No se modificaron protecciones ni permisos para diagnosticarla. |
| El puerto publicado del backend es accesible desde frontend a traves del gateway. | ✅ Verificada en este Codespace | La peticion a 172.18.0.1:8000/health devolvio status ok; docker inspect confirmo ese gateway. La direccion puede variar por entorno. |
| El ajuste del proxy recupera el flujo de datos. | ✅ Verificada | API_PROXY_TARGET en frontend/.env.local; 5173/api/metrics devolvio 360 movimientos JSON y el navegador mostro indicadores y graficos. |
| Las comprobaciones declaradas siguen pasando tras el ajuste. | ✅ Verificada | Se ejecutaron pytest, npm test, npm run build y npm run lint mediante docker compose exec. |

Cambio minimo: proxy de Vite configurable con loadEnv y ejemplo de variable API_PROXY_TARGET. Se preserva el destino por defecto y la configuracion especifica del entorno no se versiona.

El analisis de la sesion previa es una pista, no una prueba actual. El arranque, timeout, ruta alternativa, datos del proxy y UI se comprobaron de nuevo en este entorno.

## Revisión técnica antes del commit - 2026-10-02

- Se contrastaron App.tsx, routes.py, package.json y docker-compose.yml con las afirmaciones del resumen.
- Se confirmó que frontend/.env.local está ignorado por Git.
- Se repitió npm run build dentro del contenedor: compilación correcta. Vite avisa de un bundle de más de 500 kB; es un aviso, no un fallo de compilación.
- El editor muestra un error por vite/client. En el workspace existe node_modules pero falta frontend/node_modules/vite/client.d.ts. Las dependencias del contenedor sí permiten compilar. No se cambió tsconfig para ocultar el diagnóstico.

## Fase 2 — 2026-10-02

- ✅ Se volvió a leer AGENTS.md; .agents/rules, .agents/skills y memory-bank siguen ausentes antes de esta fase.
- ✅ Se contrastaron contrato, consumidor, cálculos, fechas y estructura con el código actual del Codespace. Referencias en docs/engineering-findings.md (H1–H8).
- ✅ Se confirmó frontend/package-lock.json versionado con git ls-files; no se asume ausencia de lockfile.
- ✅ Cada propuesta R1–R5 en docs/proposed-rules.md identifica alcance, evidencia y una tarea real prevista con criterio de validación.
- ✅ Se comprobó la existencia de los archivos fuente citados y se revisó el diff de la documentación.
- ❓ El riesgo de zona horaria de H3 se infiere del código; todavía falta reproducirlo. La causa exacta del problema de red de fase 1 continúa sin determinarse.
- Pendiente: implementar y validar reglas en fase 3; crear memory-bank en fase 4; revisión personal del alumno y push final.
- Esta fase modifica únicamente documentación. No se repiten pruebas de aplicación: los resultados de fase 1 siguen siendo evidencia histórica, no un nuevo resultado de esta sesión.

## Fase 3 — 2026-10-02

- ✅ Se crearon cinco reglas con nombre, alcance, justificación y acciones en .agents/rules, derivadas de H1–H8.
- ✅ Se aplicaron a tareas reales; docs/rules-validation.md registra instrucción aplicada, resultado y refinamiento de cada una.
- ✅ Contrato comprobado con OpenAPI, tipos TypeScript y 360 movimientos mediante el proxy; script reproducible docs/check-api-contract.py.
- ✅ H3 reproducido: 1 fallo y 5 pruebas correctas antes de la corrección. La agrupación ahora usa YYYY-MM sin hora local; 9 pruebas correctas en UTC y America/Los_Angeles después.
- ✅ Período calculado en lib y pasado desde App al encabezado: API y navegador coinciden en 2025-10-02 - 2026-09-28 en esta sesión.
- ✅ Backend: 15 pruebas correctas (una advertencia de TestClient); build y lint correctos. Build mantiene una advertencia por tamaño del bundle.
- ✅ Se actualizó documentación distinguiendo historia y estado actual, se revisó el diff y se comprobó exclusión de .env.local y artefactos.
- ❓ La causa exacta del fallo de red original no está determinada.
- Pendiente: memory-bank en fase 4, revisión personal del alumno y push final. Estas comprobaciones fueron realizadas por el agente, no se atribuyen como revisión personal del alumno.

## Fase 4 — 2026-10-02

- ✅ Se leyeron AGENTS.md y las cinco reglas existentes antes de crear la memoria; .agents/skills y memory-bank no existían al comenzar.
- ✅ memory-bank/README.md sirve de índice; product-overview.md documenta propósito y alcance; technical-context.md documenta stack, flujo y setup; current-state.md registra estado y prioridades de entrega.
- ✅ Se contrastaron versiones declaradas con package.json, runtimes con Dockerfiles, servicios con Compose y estado actual con App/financial-utils y los commits 7262457, cad7589 y 2b7ff2a.
- ✅ Se verificó que todos los enlaces locales de la memoria apuntan a archivos o directorios existentes y se revisó el diff.
- ✅ La memoria no inventa una hoja de ruta: distingue datos simulados, API implementada, funciones usadas por App, resultados de fase 3 y límites pendientes.
- Esta fase modifica solo documentación. No se ejecutaron nuevas pruebas de aplicación; las 9 pruebas frontend, 15 backend, build y lint citados son los resultados de fase 3.
- Pendiente: revisión personal del alumno, push de los commits al fork y envío de la entrega. No se afirma que estas acciones estén realizadas.

## Proyecto de skills — 2026-10-07

- Se confirmó origin/main en 83314f8: las fases anteriores están en GitHub. Se trabaja en feature/agent-skills sobre ese mismo repo.
- Skills cargadas/aplicadas: accessibility, vercel-react-best-practices, webapp-testing y .skills/financial-chart-integrity. La última se validó con quick_validate.py y se aplicó a la confusión de 0% con ausencia.
- Frontend: lint/build correctos, 14 pruebas en UTC y America/Los_Angeles. Backend: 15 pruebas correctas y una deprecación heredada de TestClient/httpx.
- docs/check-api-contract.py: contrato correcto, proxy con 360 movimientos y período real 2025-10-02 - 2026-09-28 en el host de verificación.
- UI de producción comprobada con teclado, escritorio/móvil y simulaciones de carga/vacío/error/equilibrio. axe sin violaciones detectadas; contraste completado con medición sRGB. Evidencia, trazabilidad, comparación de bundles y límites en docs/skills-validation.md.
- memory-bank/progress.md actualiza el estado del proyecto. No se atribuye al alumno la revisión personal de las mejoras realizadas por el agente.
- GitHub/PR y Codespaces se registran al completar la entrega; no se hace merge ni se envían mensajes al instructor.
