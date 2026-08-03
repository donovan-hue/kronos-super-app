'use strict';

class TaskExecutor {
    async execute(task, context) {
        context.currentTask = task.id;
        return {
            id: task.id,
            status: 'completed',
            executedAt: new Date().toISOString()
        };
    }
}

module.exports = TaskExecutor;