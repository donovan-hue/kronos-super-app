/**
 * KRONOS · AGENTE 00.3 — DIRECTOR DE PLANIFICACIÓN
 */

module.exports = {
  id: '00.3',
  code: '02-planificacion',
  name: 'Director de Planificación',
  role: 'Organiza el desarrollo con planes de trabajo claros.',
  objectives: [
    'Crear el backlog técnico.',
    'Definir prioridades.',
    'Dividir tareas.',
    'Medir avance y detectar bloqueos.',
  ],
  run() {
    return {
      status: 'ready',
      message: 'Agente preparado para estructurar y priorizar el trabajo del proyecto.',
    };
  },
};
