'use strict';

class ArchitectureRule {

    constructor(options = {}) {

        this.id = options.id;

        this.name = options.name;

        this.description = options.description;

        this.severity = options.severity || 'medium';

    }

    execute() {

        throw new Error('execute() debe implementarse.');

    }

}

module.exports = ArchitectureRule;
