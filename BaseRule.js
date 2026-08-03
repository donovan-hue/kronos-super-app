'use strict';

class BaseRule {
    constructor(name, severity = 'info') {
        this.name = name;
        this.severity = severity;
    }
    execute() {
        throw new Error(`${this.name} debe implementar execute().`);
    }
}

module.exports = BaseRule;