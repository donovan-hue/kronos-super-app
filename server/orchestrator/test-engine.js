const orchestrator = require("./index");
const ExecutionEngine = require("./engine/ExecutionEngine");

orchestrator.initialize();

const engine = new ExecutionEngine();

engine.execute(
    orchestrator.getAgent(1)
).then(console.log);
