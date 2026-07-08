/**
 * KRONOS · AGENTE 00.7 — DIRECTOR DE SEGURIDAD TÉCNICA
 */

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
    return {
      status: 'ready',
      message: 'Agente preparado para vigilar seguridad técnica y controles de acceso.',
    };
  },
};
