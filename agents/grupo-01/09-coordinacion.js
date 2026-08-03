/**
 * KRONOS · AGENTE 00.10 — DIRECTOR DE COORDINACIÓN
 */

module.exports = {
  id: '00.10',
  code: '09-coordinacion',
  name: 'Director de Coordinación',
  role: 'Mantiene una comunicación fluida entre todos los grupos.',
  objectives: [
    'Coordinar la comunicación entre departamentos.',
    'Evitar duplicidad de trabajo.',
    'Mantener sincronizadas las tareas.',
    'Consolidar reportes para el Director General.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para coordinar tareas y mantener alineación entre equipos.',
    };
  },
};
