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
