const memory = require("../memory/MemoryManager");
const persistentMemory = require("../memory/PersistentMemory");
class ExecutionEngine {
  async execute(agent) {
    console.log(`\n=================================`);
    console.log(`Ejecutando Agente #${agent.id}`);
    console.log(`Nombre: ${agent.name}`);
    console.log(`Objetivo: ${agent.objective}`);
    console.log(`=================================`);

    for (const task of agent.tasks) {
      console.log(`• ${task}`);
    }

    const result = {
  success: true,
  agent: agent.id,
  executedTasks: agent.tasks.length,
  timestamp: new Date().toISOString()
};

memory.save(result);

await persistentMemory.save({
  agent: result.agent,
  success: result.success,
  executedTasks: result.executedTasks,
  timestamp: result.timestamp
});

return result;
  }
}

module.exports = ExecutionEngine;
