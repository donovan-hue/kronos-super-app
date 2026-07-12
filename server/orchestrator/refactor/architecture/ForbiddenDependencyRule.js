'use strict';

const ArchitectureRule = require('./ArchitectureRule');

class ForbiddenDependencyRule extends ArchitectureRule {

    constructor() {

        super({

            id: 'ARCH-001',

            name: 'Forbidden Dependencies',

            description: 'Detecta dependencias prohibidas.',

            severity: 'high'

        });

    }

    execute(analysis, configuration) {

        const violations = [];

        const forbidden = configuration.forbiddenDependencies || [];

        analysis.dependencies.forEach(file => {

            file.dependencies.forEach(dep => {

                if (forbidden.includes(dep)) {

                    violations.push({

                        rule: this.id,

                        severity: this.severity,

                        file: file.file,

                        dependency: dep

                    });

                }

            });

        });

        return violations;

    }

}

module.exports = ForbiddenDependencyRule;
