/**
 * KRONOS · AGENTE 00.1 — DIRECTOR GENERAL
 */
const fs = require('fs');
const path = require('path');

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
  async run() {
    console.log('╔═════════════════════════════════════════════════════════════════════════════╗');
    console.log('║             KRONOS SUPER-APP · INICIANDO AUDITORÍA GENERAL                    ║');
    console.log('╚═════════════════════════════════════════════════════════════════════════════╝');
    console.log('Director General iniciando secuencia de reporte de todos los departamentos...\n');

    const reports = [];
    const agentDir = __dirname;
    const agentFiles = fs.readdirSync(agentDir)
      .filter(file => file.endsWith('.js') && file !== path.basename(__filename))
      .sort();

    for (const file of agentFiles) {
      try {
        const agent = require(path.join(agentDir, file));
        console.log(`\n--- [INICIANDO] Departamento: ${agent.name} ---`);
        
        // El método run de los agentes ahora puede ser asíncrono
        const report = await Promise.resolve(agent.run());
        
        reports.push({ agent: agent.name, report });

        // Imprimir el resumen del reporte de cada agente
        if (report.status === 'complete' && report.summary) {
            console.log(`[ESTADO] ${report.summary}`);
            if(report.findings && report.findings.length > 0) {
                console.log(`[HALLAZGOS] ${report.findings.length} puntos a revisar.`);
                report.findings.slice(0, 2).forEach(f => console.log(`  - ${f.sev}: ${f.msg.substring(0, 80)}...`));
                if (report.findings.length > 2) console.log(`  ...y ${report.findings.length - 2} más.`);
            }
        } else {
            console.log(`[ESTADO] ${report.message}`);
        }
        console.log(`--- [COMPLETADO] Departamento: ${agent.name} ---\n`);

      } catch (error) {
        console.error(`Error ejecutando agente ${file}:`, error);
        reports.push({ agent: file, report: { status: 'error', message: error.message } });
      }
    }

    console.log('╔═════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        AUDITORÍA GENERAL COMPLETADA                         ║');
    console.log('╚═════════════════════════════════════════════════════════════════════════════╝');
    console.log('Todos los departamentos han reportado. Revisar los logs para ver el detalle.\n');

    // En un futuro, este resultado se podría guardar o enviar a otro sistema.
    return { status: 'complete', summary: 'Auditoría general finalizada.', details: reports };
  },
};
