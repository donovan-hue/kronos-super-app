'use strict';

const ArchitectureRule = require('./ArchitectureRule');

class LayerValidator extends ArchitectureRule {

    constructor() {

        super({

            id: 'ARCH-002',

            name: 'Layer Validator',

            severity: 'high'

        });

    }

    execute(project) {

        return [];

    }

}

module.exports = LayerValidator;
