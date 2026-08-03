'use strict';

class Task {
    constructor(options = {}) {
        this.id = options.id;
        this.title = options.title;
        this.description = options.description;
        this.priority = options.priority || 'medium';
        this.risk = options.risk || 'low';
        this.category = options.category || 'general';
        this.dependencies = options.dependencies || [];
        this.rollback = options.rollback !== false;
        this.validation = options.validation || [];
        this.data = options.data || {};
    }
}

module.exports = Task;