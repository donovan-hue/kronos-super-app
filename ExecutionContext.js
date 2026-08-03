'use strict';

class ExecutionContext {
    constructor() {
        this.id = `EXEC-${Date.now()}`;
        this.startedAt = new Date().toISOString();
        this.finishedAt = null;
        this.status = 'pending';
        this.currentTask = null;
        this.completedTasks = [];
        this.failedTasks = [];
        this.rollbackStack = [];
    }

    finish(status = 'completed') {
        this.status = status;
        this.finishedAt = new Date().toISOString();
    }
}

module.exports = ExecutionContext;