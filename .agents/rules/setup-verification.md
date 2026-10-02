# R4 — Verificar el arranque por capas

**Justificación:** La salud del backend y la comunicación mediante proxy son comprobaciones distintas.

**Alcance:** Docker Compose, Vite, variables de entorno y comprobaciones. **Evidencia:** H5, H6, H8.

Usar el setup documentado con Docker Compose. Ante problemas de comunicación, comprobar backend /health y frontend /api/metrics por separado y revisar contenido y estado HTTP. Mantener el destino por defecto http://backend:8000. Si el entorno requiere API_PROXY_TARGET, obtener su valor del entorno real y guardarlo en .env.local ignorado; documentar la variable en .env.example sin secretos. Diferenciar esta variable de VITE_API_BASE_URL. No presentar una ruta alternativa como causa raíz resuelta.

**Aplicación:** leer antes de actuar dentro del alcance. Validación en docs/rules-validation.md.

**Refinamiento tras validación:** Después de abrir o reiniciar un Codespace, ejecutar docker compose ps: que el editor esté abierto no implica servicios activos. Si están parados, usar docker compose up --build -d. Si salud, proxy y pantalla funcionan, no cambiar el destino local sin motivo.
