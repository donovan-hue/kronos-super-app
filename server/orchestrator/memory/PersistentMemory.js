const ExecutionLog = require("../models/ExecutionLog");

class PersistentMemory {
  async save(data) {
    try {
      await ExecutionLog.create(data);
    } catch (err) {
      console.error("[PersistentMemory]", err.message);
    }
  }

  async history(limit = 100) {
    return ExecutionLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
  }

  async last() {
    return ExecutionLog.findOne()
      .sort({ timestamp: -1 })
      .lean();
  }

  async clear() {
    await ExecutionLog.deleteMany({});
  }
}

module.exports = new PersistentMemory();
