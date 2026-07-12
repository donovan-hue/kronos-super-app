'use strict';
const TaskFactory = require('./TaskFactory');
const PriorityManager = require('./PriorityManager');
const DependencyResolver = require('./DependencyResolver');

class ExecutionPlanner {
    constructor() {
        this.factory = new TaskFactory();
        this.priority = new PriorityManager();
        this.dependencies = new DependencyResolver();
    }

    build(findings) {
        let tasks = findings.map(
            (item, index) => this.factory.create(item, index)
        );
        tasks = this.priority.sort(tasks);
        tasks = this.dependencies.resolve(tasks);
        return { generatedAt: new Date().toISOString(), totalTasks: tasks.length, tasks };
    }
}

module.exports = ExecutionPlanner;