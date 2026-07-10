/**
 * KRONOS · AGENTE 00.7 — DIRECTOR DE SEGURIDAD TÉCNICA
 */
const kairos = require('../kairos');

module.exports = {
  id: '00.7',
  code: '06-seguridad',
  name: 'Director de Seguridad Técnica',
  role: 'Asegura la protección del sistema en todas sus capas.',
  objectives: [
    'Definir políticas de seguridad.',
    'Revisar autenticación y autorización.',
    'Supervisar gestión de secretos.',
    'Priorizar correcciones de vulnerabilidades.',
  ],
  run() {
    const { findings } = kairos.audit();
    const securityFindings = findings.filter(f => f.area === 'security');

    if (securityFindings.length === 0) {
      return {
        status: 'complete',
        summary: 'No se encontraron vulnerabilidades de seguridad evidentes. Las defensas básicas están activas.',
        findings: [],
      };
    }

    return {
      status: 'complete',
      summary: `Se detectaron ${securityFindings.length} posibles problemas de seguridad. Se requiere revisión manual.`,
      findings: securityFindings,
    };
  },
};
