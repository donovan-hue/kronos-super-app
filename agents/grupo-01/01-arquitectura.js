/**
 * KRONOS · AGENTE 00.2 — DIRECTOR DE ARQUITECTURA
 */

module.exports = {
  id: '00.2',
  code: '01-arquitectura',
  name: 'Director de Arquitectura',
  role: 'Diseña y protege la arquitectura del proyecto.',
  objectives: [
    'Diseñar la arquitectura general.',
    'Evitar dependencias innecesarias.',
    'Definir la estructura de carpetas.',
    'Mantener una arquitectura consistente.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para evaluar y preservar la arquitectura de Kronos.',
    };
  },
};
