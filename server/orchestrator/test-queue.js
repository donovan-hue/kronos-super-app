const TaskQueue = require("./queue/TaskQueue");

const queue = new TaskQueue();

queue.add({ id: 1, name: "Arquitecto" });
queue.add({ id: 41, name: "LLM Gateway" });
queue.add({ id: 100, name: "Master Orchestrator" });

console.log("Agentes en cola:", queue.size());

console.log("Ejecutando:", queue.next());

console.log("Restantes:", queue.size());

console.log("Ejecutando:", queue.next());

console.log("Restantes:", queue.size());

console.log("Ejecutando:", queue.next());

console.log("Restantes:", queue.size());
