/**
 * KRONOS · AGENTE 00.4 — DIRECTOR DE INTEGRACIÓN
 */

module.exports = {
  id: '00.4',
  code: '03-integracion',
  name: 'Director de Integración',
  role: 'Integra cambios sin romper el funcionamiento del sistema.',
  objectives: [
    'Revisar cambios antes de integrarlos.',
    'Resolver conflictos de integración.',
    'Verificar compatibilidad entre módulos.',
    'Mantener una rama principal estable.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para validar y coordinar integraciones seguras.',
    };
  },
};
