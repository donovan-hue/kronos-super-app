const path = require("path");
const AgentLoader = require("./loader/AgentLoader");

const loader = new AgentLoader(
  path.join(__dirname, "../../kronos-super-app/agents")
);

const agents = loader.load();

console.log("=================================");
console.log("Agentes cargados:", agents.length);
console.log("Primer agente:", loader.getById(1).name);
console.log("Último agente:", loader.getById(100).name);
console.log("Grupo 05:", loader.getByGroup("group-05").length);
console.log("=================================");
