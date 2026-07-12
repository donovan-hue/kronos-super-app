const orchestrator = require("./index");

orchestrator.initialize();

console.log(orchestrator.getAgent(100).name);
console.log(orchestrator.getGroup("group-03").length);
console.log(orchestrator.getAllAgents().length);
