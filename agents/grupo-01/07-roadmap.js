/**
 * KRONOS · AGENTE 00.8 — DIRECTOR DEL ROADMAP
 */

module.exports = {
  id: '00.8',
  code: '07-roadmap',
  name: 'Director del Roadmap',
  role: 'Define la evolución funcional y técnica del proyecto.',
  objectives: [
    'Mantener el roadmap.',
    'Priorizar nuevas funciones.',
    'Organizar versiones y lanzamientos.',
    'Alinear el desarrollo con la estrategia.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para planificar entregas y evolución del producto.',
    };
  },
};
