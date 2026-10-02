# Stack y ejecución

## Tecnologías verificadas

| Parte | Tecnología | Fuente |
|---|---|---|
| Interfaz | React, TypeScript, Vite, Tailwind CSS y Recharts | [package.json](../frontend/package.json), [vite.config.ts](../frontend/vite.config.ts) |
| Calidad frontend | Vitest, ESLint; build ejecuta TypeScript y Vite | scripts y devDependencies de package.json |
| API | Python, FastAPI, modelos Pydantic, Uvicorn y debugpy | [main.py](../backend/app/main.py), [routes.py](../backend/app/routes.py), [requirements.txt](../backend/requirements.txt) |
| Calidad backend | pytest, pytest-cov y httpx | requirements.txt y [test_routes.py](../backend/tests/test_routes.py) |
| Entorno | Docker Compose, Node 24 y Python 3.13 | [docker-compose.yml](../docker-compose.yml), [Dockerfile frontend](../frontend/Dockerfile), [Dockerfile backend](../backend/Dockerfile) |

package.json declara rangos de versión, entre ellos React ^19.2.4, Vite ^8.0.4 y TypeScript ~6.0.2; no son una afirmación de versiones exactas instaladas. Existe [package-lock.json](../frontend/package-lock.json) versionado. requirements.txt no fija versiones. Los Dockerfiles actuales instalan con npm install y pip install -r requirements.txt. No se cambiaron dependencias para esta entrega.

## Flujo y estructura

main.tsx monta App. App solicita /api/metrics, calcula con funciones de lib y pasa resultados a components/dashboard; components/ui contiene elementos reutilizables. El alias @ está configurado en Vite y tsconfig.app.json. FastAPI main incluye el router de routes.py.

Con la configuración de desarrollo habitual, el navegador llama al frontend en 5173 y el proxy de Vite reenvía /api al backend en 8000. El puerto 5678 es para debugpy. Compose monta los directorios fuente y usa un volumen de dependencias del frontend: que el editor local encuentre tipos no se deduce de que existan en el contenedor.

## Arranque y diagnóstico

Desde la raíz del Codespace:

~~~bash
docker compose up --build -d
docker compose ps
curl --fail --max-time 10 http://127.0.0.1:8000/health
python3 docs/check-api-contract.py
~~~

Abrir el puerto 5173 reenviado en Codespaces para ver la pantalla. El script comprueba el contrato actual con OpenAPI y los movimientos recibidos por el proxy; no es una validación JSON incorporada al navegador.

API_PROXY_TARGET configura el destino del proxy de Vite, con valor por defecto http://backend:8000. VITE_API_BASE_URL configura el prefijo de URL utilizado por el navegador. Ver vite.config.ts y App.tsx: cumplen funciones distintas.

Si /health funciona pero /api/metrics mediante Vite falla, seguir [.agents/rules/setup-verification.md](../.agents/rules/setup-verification.md) y el diagnóstico de [project-overview.md](../docs/project-overview.md). En este Codespace se usó una ruta por el gateway al puerto publicado, guardada en frontend/.env.local ignorado. Obtener el gateway del contenedor real; no copiar una IP como constante universal. .env.example documenta la variable sin guardar datos locales. La causa original del fallo de red permanece sin determinarse.

## Comprobaciones relevantes

~~~bash
docker compose exec -T frontend env TZ=UTC npm test -- --run
docker compose exec -T frontend env TZ=America/Los_Angeles npm test -- --run
docker compose exec -T frontend npm run build
docker compose exec -T frontend npm run lint
docker compose exec -T backend pytest -q
~~~

Ejecutar las comprobaciones pertinentes al cambio. Para cambios solo documentales, revisar hechos, referencias y diff; no atribuir resultados antiguos a una ejecución nueva. Las pruebas unitarias no sustituyen la comprobación HTTP del proxy y la observación de la pantalla.
