# Kronos Super App — Contexto para agentes

**Stack real:** React (web, no React Native) en `client/src/`. Backend Express + Mongoose en `server/`. Socket.io, Redis opcional (`cacheService.js`), Stripe (México, IVA 16%), Cloudinary. Deploy: Vercel (frontend) / Render (backend, Root Directory = `server`).

**Sistema de agentes activo:** `kronos-super-app/agents/group-01` a `group-10` (100 agentes JSON), cargado por `server/orchestrator/`. Fuente maestra: `kronos-super-app/orchestrator/kronos_master_agents.json`.

**Directivas de dominio:** ver `backend_master.md`, `database_master.md`, `payments_master.md`, `authentication_master.md`, `security_backend.md`, `performance_backend.md`, `backend_qa.md`, `api_manager.md`, `ai_backend.md`, `socket_master.md` en la raíz. Aplican junto con las reglas de arquitectura y estándares de código del equipo (SOLID, tipado estricto, manejo de errores defensivo, testing).

**No usar:** `agents/*.js`, `agents/grupo-01/*.js`, `server/agents/*.js` — legacy, sin conexión (ver `agents/README.md`).

**Pendiente conocido:** crash de heap en build, ~20 warnings de ESLint (hooks, variables sin usar).
