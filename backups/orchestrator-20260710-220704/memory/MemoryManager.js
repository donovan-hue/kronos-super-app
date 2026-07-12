class MemoryManager {
  constructor() {
    this.memory = [];
  }

  save(entry) {
    this.memory.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
  }

  getAll() {
    return this.memory;
  }

  last() {
    return this.memory[this.memory.length - 1] || null;
  }

  clear() {
    this.memory = [];
  }
}

module.exports = new MemoryManager();
