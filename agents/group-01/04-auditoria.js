/**
 * KRONOS · AGENTE 00.5 — DIRECTOR DE AUDITORÍA
 */
const kairos = require('../kairos');

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
    const { findings } = kairos.audit();
    const errors = findings.filter(f => f.sev === 'error').length;
    const warnings = findings.filter(f => f.sev === 'warn').length;

    if (findings.length === 0) {
      return {
        status: 'complete',
        summary: 'Auditoría completa sin hallazgos críticos. El proyecto está en buen estado.',
        findings: [],
      };
    }
    return {
      status: 'complete',
      summary: `Auditoría completada. Se encontraron ${errors} errores y ${warnings} advertencias.`,
      findings,
    };
  },
};
