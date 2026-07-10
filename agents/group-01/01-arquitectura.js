/**
 * KRONOS · AGENTE 00.2 — DIRECTOR DE ARQUITECTURA
 */
const fs = require('fs');
const path = require('path');

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
  _walk(dir, root) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        // Ignorar directorios que no queremos escanear
        if (['node_modules', '.git', '.next', 'build', 'dist'].includes(file)) return;
        results.push(path.relative(root, fullPath).replace(/\\/g, '/'));
        results = results.concat(this._walk(fullPath, root));
      } else {
        results.push(path.relative(root, fullPath).replace(/\\/g, '/'));
      }
    });
    return results;
  },
  _parseBlueprint() {
    return this.blueprint
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('│') && !line.startsWith('├──') && !line.startsWith('└──'))
      .map(line => line.replace('kronos-super-app/', ''))
      .filter(Boolean);
  },
  blueprint: `
kronos-super-app/
├── .github/
│   └── workflows/
├── .vscode/
├── agents/
│   ├── group-01/
│   ├── group-02/
│   ├── group-03/
│   ├── group-04/
│   ├── group-05/
│   ├── group-06/
│   ├── group-07/
│   ├── group-08/
│   ├── group-09/
│   ├── group-10/
│   └── registry.json
├── backup/
│   ├── snapshots/
│   ├── quarantine/
│   └── recovery/
├── client/
│   ├── public/
│   ├── src/
│   ├── scripts/
│   └── package.json
├── deployment/
│   ├── cloudflare/
│   ├── docker/
│   ├── render/
│   ├── vercel/
│   ├── koyeb/
│   └── scripts/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   ├── agents/
│   ├── reports/
│   └── diagrams/
├── logs/
│   ├── orchestrator/
│   ├── agents/
│   ├── deployments/
│   └── system/
├── memory/
│   ├── agents/
│   ├── workflows/
│   └── sessions/
├── orchestrator/
│   ├── api/
│   ├── planner/
│   ├── engine/
│   ├── queue/
│   ├── registry/
│   ├── workflows/
│   ├── events/
│   ├── memory/
│   ├── utils/
│   └── refactor/
│       ├── analyzer.js
│       ├── planner.js
│       ├── executor.js
│       ├── verifier.js
│       ├── rollback.js
│       ├── logger.js
│       ├── gitManager.js
│       ├── backupManager.js
│       ├── duplicateDetector.js
│       ├── projectDetector.js
│       ├── importResolver.js
│       ├── reportManager.js
│       ├── api.js
│       ├── cli.js
│       └── index.js
├── prompts/
│   ├── agents/
│   ├── system/
│   └── workflows/
├── scripts/
│   ├── install/
│   ├── maintenance/
│   ├── deploy/
│   └── utilities/
├── server/
│   ├── agents/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── orchestrator/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── package.json
│   └── server.js
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
├── workflows/
│   ├── deployment/
│   ├── maintenance/
│   ├── agents/
│   └── automation/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── render.yaml
`,
  run() {
    const projectRoot = path.resolve(__dirname, '..', '..');
    const blueprintPaths = new Set(this._parseBlueprint());
    const actualPaths = new Set(this._walk(projectRoot, projectRoot));

    const missing = [...blueprintPaths].filter(p => !actualPaths.has(p));
    const extra = [...actualPaths].filter(p => !blueprintPaths.has(p) && p !== 'agents/group-01/01-arquitectura.js'); // Ignorarse a sí mismo si no está en el blueprint

    if (missing.length === 0 && extra.length === 0) {
      return {
        status: 'complete',
        summary: 'La estructura de carpetas coincide perfectamente con el blueprint definido.',
        findings: [],
      };
    }

    return {
      status: 'complete',
      summary: `Se encontraron desviaciones en la arquitectura: ${missing.length} elementos faltantes y ${extra.length} elementos no definidos.`,
      details: {
        missing,
        extra,
      },
      message: `Faltan ${missing.length} carpetas/archivos y hay ${extra.length} no esperados.`,
    };
  },
};
