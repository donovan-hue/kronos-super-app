'use strict';
const ExecutionContext = require('./ExecutionContext');
const TaskExecutor = require('./TaskExecutor');
const Validator = require('./Validator');

class ExecutionEngine {
    constructor() {
        this.executor = new TaskExecutor();
        this.validator = new Validator();
    }

    async execute(plan) {
        const context = new ExecutionContext();
        for (const task of plan.tasks) {
            try {
                const result = await this.executor.execute(
                    task,
                    context
                );
                const validation = await this.validator.validate(task);
                context.completedTasks.push({
                    result,
                    validation
                });
            } catch (error) {
                context.failedTasks.push({
                    task,
                    error: error.message
                });
                context.finish('failed');
                return context;
            }
        }
        context.finish();
        return context;
    }
}

module.exports = ExecutionEngine;