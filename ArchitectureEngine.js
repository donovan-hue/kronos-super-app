'use strict';

const ForbiddenDependencyRule = require('./ForbiddenDependencyRule');
const LayerValidator = require('./LayerValidator');
const CycleDetector = require('./CycleDetector');
const ModuleBoundaryValidator = require('./ModuleBoundaryValidator');

class ArchitectureEngine {
    constructor(configuration = {}) {
        this.configuration = configuration;
        this.rules = [
            new ForbiddenDependencyRule(),
            new LayerValidator()
        ];
        this.cycles = new CycleDetector();
        this.boundaries = new ModuleBoundaryValidator();
    }
    execute(project) {
        const violations = [];
        this.rules.forEach(rule => {
            violations.push(
                ...rule.execute(
                    project.analysis,
                    this.configuration
                )
            );
        });
        return {
            generatedAt: new Date().toISOString(),
            violations,
            cycles: this.cycles.detect(project),
            boundaries: this.boundaries.validate(project),
            score: Math.max(
                0,
                100 - violations.length * 5
            )
        };
    }
}

module.exports = ArchitectureEngine;