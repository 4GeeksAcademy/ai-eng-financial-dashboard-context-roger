# Fase 1: resumen del proyecto verificado

Fecha de verificacion: 2026-10-01. Entorno: Codespaces expert rotary-phone.

## Producto y alcance real

Dashboard de movimientos financieros de ejemplo. Muestra ingresos, gastos, beneficio y margen, con graficos mensuales. No hay base de datos ni autenticacion de aplicacion declaradas en los archivos inspeccionados.

## Recorrido de los datos

1. frontend/src/main.tsx monta App.
2. frontend/src/App.tsx pide /api/metrics usando VITE_API_BASE_URL, o una ruta relativa si no se configura.
3. frontend/vite.config.ts reenvia /api al backend durante desarrollo.
4. backend/app/main.py crea FastAPI e incluye el router de backend/app/routes.py.
5. generate_mock_movements(seed=42) genera 360 movimientos; las fechas dependen de date.today().
6. frontend/src/lib/financial-utils.ts calcula los indicadores y agrupa por ano y mes.
7. Los componentes en frontend/src/components/dashboard presentan indicadores y graficos con Recharts.

La API tambien ofrece facets, summary, categories/top, comparison, alerts, b2b y b2c. App.tsx actualmente utiliza /api/metrics; la existencia de una ruta de API no demuestra que tenga interfaz propia.

## Ejecucion basada en archivos

Docker Compose define frontend y backend. frontend/Dockerfile usa Node 24 y Vite; backend/Dockerfile usa Python 3.13, Uvicorn y debugpy. Los puertos publicados son 5173, 8000 y 5678 (depuracion).

~~~bash
docker compose up --build -d
docker compose ps
curl -fsS --max-time 10 http://127.0.0.1:8000/health
curl -fsS --max-time 10 http://127.0.0.1:5173/api/metrics
~~~

En Codespaces se abre la URL reenviada del puerto 5173 en la pestana Puertos. Los puertos permanecen privados.

## Incidencia del Codespace y ajuste aplicado

El backend respondia por el puerto publicado, pero el contenedor frontend agotaba el tiempo al conectar con backend:8000. La resolucion DNS funcionaba. La causa exacta de esa conectividad no esta establecida.

La conexion desde frontend al gateway de la red Compose, usando el puerto publicado 8000, si respondio. Se incorporo API_PROXY_TARGET a vite.config.ts mediante loadEnv. Su valor por defecto sigue siendo http://backend:8000. Es una opcion del servidor Vite; no cambia la URL que utiliza el navegador.

Para este entorno se configuro frontend/.env.local con el gateway obtenido de docker inspect. Ese archivo queda ignorado por Git. No fijar una IP de este Codespace como configuracion universal.

Para obtener el gateway vigente:

~~~bash
docker inspect "$(docker compose ps -q backend)" --format '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}'
~~~

Si se reproduce la misma incidencia, comprobar primero que http://GATEWAY:8000/health responde desde el contenedor frontend y configurar API_PROXY_TARGET=http://GATEWAY:8000 en frontend/.env.local. Reiniciar frontend con docker compose restart frontend. GATEWAY es un marcador que se sustituye por el resultado verificado, no un hostname literal.

## Comprobaciones ejecutadas

~~~bash
docker compose exec -T backend pytest -q
docker compose exec -T frontend npm test
docker compose exec -T frontend npm run build
docker compose exec -T frontend npm run lint
~~~

Las cuatro comprobaciones terminaron correctamente. El proxy devolvio JSON con 360 movimientos y el navegador mostro los indicadores y ambos graficos.

## Limitaciones verificadas

- App.tsx mantiene una etiqueta fija de periodo 2024; no representa las fechas actuales del dataset.
- frontend/src/lib/mock-data.ts existe, pero App.tsx no lo importa como fuente activa.
- Los datos son simulados. Una semilla fija no fija el periodo porque el generador consulta la fecha actual.
- Las reglas y el memory-bank corresponden a fases posteriores; este resumen no demuestra su validacion.

## Estado actualizado tras fase 3 — 2026-10-02

La etiqueta fija de 2024 descrita en la fase 1 era el estado inicial; ahora App pasa el resultado de computeDataPeriod de financial-utils.ts al encabezado. Este cálculo muestra las fechas mínima y máxima reales, una fecha única o un mensaje cuando no hay datos. En esta sesión API y navegador mostraron 2025-10-02 - 2026-09-28; ese rango cambiará con la fecha de generación.

Se confirmó y corrigió el riesgo de agrupación por zona horaria: computeMonthlyData ahora usa el prefijo YYYY-MM de create_date, sin convertir la fecha de calendario a hora local. Hay 9 pruebas del frontend correctas en UTC y America/Los_Angeles, 15 del backend correctas, build y lint correctos. Ver docs/rules-validation.md para tareas y límites.

Existen cinco reglas en .agents/rules y su validación está documentada. memory-bank todavía está pendiente de fase 4; también quedan la revisión personal del alumno y el push final.
