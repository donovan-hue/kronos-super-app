const orchestrator = require("./index");
const ExecutionEngine = require("./engine/ExecutionEngine");

const id = parseInt(process.argv[2], 10);

if (!id) {
  console.error("Uso: node server/orchestrator/run-agent.js <id>");
  process.exit(1);
}

orchestrator.initialize();

const agent = orchestrator.getAgent(id);

if (!agent) {
  console.error(`Agente ${id} no encontrado.`);
  process.exit(1);
}

const engine = new ExecutionEngine();

engine.execute(agent)
  .then(result => {
    console.log("\nResultado:");
    console.log(result);
  })
  .catch(console.error);
