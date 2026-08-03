class TaskQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  add(agent) {
    this.queue.push(agent);
    return this.queue.length;
  }

  next() {
    return this.queue.shift();
  }

  size() {
    return this.queue.length;
  }

  isRunning() {
    return this.running;
  }

  setRunning(value) {
    this.running = value;
  }

  clear() {
    this.queue = [];
  }
}

module.exports = TaskQueue;
