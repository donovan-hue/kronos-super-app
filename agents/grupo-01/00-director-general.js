/**
 * KRONOS · AGENTE 00.1 — DIRECTOR GENERAL
 */

module.exports = {
  id: '00.1',
  code: '00-director-general',
  name: 'Director General',
  role: 'Dirige el proyecto y coordina todos los grupos.',
  objectives: [
    'Mantener una visión global del proyecto.',
    'Coordinar todos los grupos.',
    'Priorizar tareas.',
    'Aprobar integraciones y despliegues.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para liderar la estrategia general de Kronos.',
    };
  },
};
