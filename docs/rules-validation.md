# Fase 3: validación de reglas — 2026-10-02

## Método

Se leyeron AGENTS.md y las cinco reglas antes de ejecutar las tareas dentro de sus alcances. .agents/skills y memory-bank no existían en esta fase. Las tareas fueron realizadas por el agente y contrastadas con código, comandos y navegador; queda pendiente la revisión personal del alumno. Cada caso indica cómo la instrucción cambió o limitó la actuación.

| Regla | Tarea real y decisión guiada | Evidencia y resultado | Ajuste de la regla |
|---|---|---|---|
| R1 api-contract.md | Auditar el contrato actual sin inventar cambios: comparar campos y enums TypeScript con el esquema OpenAPI servido por el backend y examinar la respuesta mediante Vite. | python3 docs/check-api-contract.py: Contract OK (create_date, amount, operation_type, category, business_type); Proxy OK: 360 movements. Comprueba fecha ISO, cantidad numérica y valores admitidos. No hubo divergencia; se conservó el contrato. | Añadir comando reproducible y aclarar que esta comprobación del contrato actual no agrega validación JSON al navegador ni es un parser TypeScript general. |
| R2 financial-dates.md | Investigar H3 con una prueba de movimientos en 2025-12-01 y 2026-01-01 bajo TZ=America/Los_Angeles, antes de corregir. | Antes: 5 pruebas pasan y la nueva falla: Nov 2025 / Dec 2025 en lugar de Dec 2025 / Jan 2026. Después: computeMonthlyData usa create_date.slice(0, 7); 9 pruebas pasan en Los Ángeles y UTC. Se mantienen las fórmulas y formatos monetarios. | Precisar que una fecha de calendario ISO se agrupa por sus caracteres YYYY-MM, sin convertirla a hora local. Exigir primer día de mes y cambio de año al tocar agrupación. |
| R3 frontend-structure.md | Corregir el período fijo siguiendo la separación existente: computeDataPeriod en lib, App lo calcula con los movimientos y pasa period al encabezado. | Pruebas: datos desordenados, conjunto vacío y fecha única. App usa el alias @ existente; no se duplican cálculos en dashboard-header. Build y lint pasan. Navegador: 2025-10-02 - 2026-09-28, coincidente con API; se conservan los KPIs. | Añadir este ejemplo concreto de transformación en lib y prop de presentación; no se cambia el alias ni la organización. |
| R4 setup-verification.md | Reanudar un Codespace cuyos servicios estaban parados usando docker compose up --build -d y verificar capas distintas. | Ambos servicios arrancan. curl --fail --max-time 10 http://127.0.0.1:8000/health devuelve status ok; proxy entrega JSON y el script confirma 360 movimientos. Navegador muestra datos. .env.local sigue ignorado. | Documentar que un Codespace abierto no garantiza contenedores activos; comprobar docker compose ps. No modificar configuración local si la ruta ya funciona. |
| R5 evidence-delivery.md | Actualizar documentación al confirmar H3 y corregir período; revisar diff y archivos antes del commit propio de fase 3. | project-overview.md, engineering-findings.md y verification.md distinguen estado histórico y actual. Los pendientes no se marcan como resueltos. Revisión de diff y exclusión de .env.local y dist. | Añadir que hallazgos y resultados antiguos se conservan como historia y se complementan con una actualización fechada. |

## Comandos para repetir la validación

Ejecutar desde la raíz del repositorio, con los servicios activos:

~~~bash
python3 docs/check-api-contract.py
docker compose exec -T frontend env TZ=America/Los_Angeles npm test -- --run
docker compose exec -T frontend env TZ=UTC npm test -- --run
docker compose exec -T backend pytest -q
docker compose exec -T frontend npm run build
docker compose exec -T frontend npm run lint
git diff --check
git check-ignore frontend/.env.local
~~~

El script usa únicamente Python estándar y lee el esquema y el proxy por localhost. Su comparación está diseñada para el formato actual de financial-types.ts; una reorganización de los tipos puede exigir adaptarlo. No modifica datos de la API.

## Límites y pendientes

- La causa exacta del problema de red de fase 1 permanece desconocida; la ruta configurada funciona en esta sesión.
- Build correcto con advertencia de bundle mayor de 500 kB (584.38 kB); no se hace una refactorización de rendimiento para esta entrega.
- Backend: 15 pruebas pasan con una advertencia de deprecación del TestClient; no impide el resultado.
- La comprobación visual es manual del agente en el navegador; no equivale a una suite automatizada de extremo a extremo.
- Fase 4 (memory-bank), revisión del alumno y push final permanecen pendientes.
