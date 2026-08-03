const express = require("express");
const memory = require("../orchestrator/memory/MemoryManager");
const router = express.Router();

const orchestrator = require("../orchestrator");

router.get("/status", (req, res) => {
  res.json({
    success: true,
    status: "online",
    agents: orchestrator.getAllAgents().length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get("/agents", (req, res) => {
  res.json(orchestrator.getAllAgents());
});

router.get("/agents/:id", (req, res) => {
  const agent = orchestrator.getAgent(parseInt(req.params.id));

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: "Agente no encontrado"
    });
  }

  res.json(agent);
});


const ExecutionEngine = require("../orchestrator/engine/ExecutionEngine");

router.post("/run/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const agent = orchestrator.getAgent(id);

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: "Agente no encontrado"
    });
  }

  const engine = new ExecutionEngine();

  try {
    const result = await engine.execute(agent);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
const WorkflowEngine = require("../orchestrator/workflows/WorkflowEngine");

router.post("/workflow", async (req, res) => {
  try {
    const { agents } = req.body;

    if (!Array.isArray(agents) || agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar un arreglo de IDs de agentes."
      });
    }

    const workflowAgents = agents
      .map(id => orchestrator.getAgent(id))
      .filter(Boolean);

    const engine = new WorkflowEngine();
    const results = await engine.executeAgents(workflowAgents);

    res.json({
      success: true,
      executed: results.length,
      results
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
const GoalPlanner = require("../orchestrator/planner/GoalPlanner");

router.post("/goal", async (req, res) => {
  try {
    const planner = new GoalPlanner();

    const workflow = planner.plan(req.body.goal);

    const workflowAgents = workflow
      .map(id => orchestrator.getAgent(id))
      .filter(Boolean);

    const engine = new WorkflowEngine();

    const results = await engine.executeAgents(workflowAgents);

    res.json({
      success: true,
      goal: req.body.goal,
      workflow,
      executed: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
router.get("/memory", (req, res) => {
  res.json({
    success: true,
    total: memory.getAll().length,
    last: memory.last(),
    history: memory.getAll()
  });
});
module.exports = router;
