#!/usr/bin/env node
/**
 * KRONOS SUPER-APP · EJECUTOR DEL DIRECTOR GENERAL
 * Inicia la auditoría completa de todos los departamentos
 */

const directorGeneral = require('./agents/group-01/00-director-general');

async function main() {
  try {
    const result = await directorGeneral.run();
    console.log('\n');
    console.log('╔═════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                     REPORTE FINAL DEL DIRECTOR GENERAL                      ║');
    console.log('╚═════════════════════════════════════════════════════════════════════════════╝');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando Director General:', error);
    process.exit(1);
  }
}

main();
