/**
 * KRONOS · AGENTE 00.5 — DIRECTOR DE AUDITORÍA
 */

module.exports = {
  id: '00.5',
  code: '04-auditoria',
  name: 'Director de Auditoría',
  role: 'Inspecciona el proyecto para detectar riesgos y deuda técnica.',
  objectives: [
    'Auditar el código.',
    'Detectar errores críticos.',
    'Detectar vulnerabilidades.',
    'Generar informes de hallazgos.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para auditar calidad, seguridad y estabilidad.',
    };
  },
};
