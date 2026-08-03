const mongoose = require("mongoose");

const ExecutionLogSchema = new mongoose.Schema({
  agent: {
    type: Number,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  executedTasks: {
    type: Number,
    default: 0
  },
  workflow: {
    type: String,
    default: null
  },
  goal: {
    type: String,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ExecutionLog", ExecutionLogSchema);
