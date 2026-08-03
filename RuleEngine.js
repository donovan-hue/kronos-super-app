// ... dentro del método run() de tu clase, después de obtener 'analysis'
const findings = this.ruleEngine.execute(analysis);
this.rulesReport.save(findings);
'use strict';
const DuplicateFilesRule = require('./DuplicateFilesRule');
const LargeFileRule = require('./LargeFileRule');
const ComplexityRule = require('./ComplexityRule');
const DependencyRule = require('./DependencyRule');

class RuleEngine {
    constructor() {
        this.rules = [
            new DuplicateFilesRule(),
            new LargeFileRule(),
            new ComplexityRule(),
            new DependencyRule()
        ];
    }
    execute(report) {
        const findings = [];
        this.rules.forEach(rule => {
            findings.push(...rule.execute(report));
        });
        findings.sort((a, b) => {
            const priority = { high: 3, medium: 2, low: 1, info: 0 };
            return priority[b.severity] - priority[a.severity];
        });
        return findings;
    }
}

module.exports = RuleEngine;