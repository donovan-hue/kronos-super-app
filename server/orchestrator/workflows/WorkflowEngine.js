const TaskQueue = require("../queue/TaskQueue");
const ExecutionEngine = require("../engine/ExecutionEngine");

class WorkflowEngine {
  constructor() {
    this.queue = new TaskQueue();
    this.engine = new ExecutionEngine();
  }

  async executeAgents(agents) {
    if (this.queue.isRunning()) {
      throw new Error("Ya existe un workflow ejecutándose.");
    }

    this.queue.setRunning(true);

    for (const agent of agents) {
      this.queue.add(agent);
    }

    const results = [];

    try {
      while (this.queue.size() > 0) {
        const agent = this.queue.next();
        const result = await this.engine.execute(agent);
        results.push(result);
      }
    } finally {
      this.queue.setRunning(false);
    }

    return results;
  }
}

module.exports = WorkflowEngine;
