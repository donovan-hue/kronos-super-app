const path = require("path");
const AgentLoader = require("./loader/AgentLoader");
const AgentRegistry = require("./registry/AgentRegistry");

class KronosOrchestrator {
  constructor() {
    this.loader = new AgentLoader(
      path.join(__dirname, "../../kronos-super-app/agents")
    );

    this.registry = new AgentRegistry();
  }

  initialize() {
    const agents = this.loader.load();
    this.registry.register(agents);

    console.log("=================================");
    console.log("KRONOS ORCHESTRATOR INICIADO");
    console.log("Agentes:", this.registry.count());
    console.log("=================================");
  }

  getAgent(id) {
    return this.registry.get(id);
  }

  getGroup(group) {
    return this.registry.getGroup(group);
  }

  getAllAgents() {
    return this.registry.getAll();
  }
}

module.exports = new KronosOrchestrator();
