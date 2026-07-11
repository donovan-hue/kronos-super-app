'use strict';
const BaseRule = require('./BaseRule');

class DependencyRule extends BaseRule {
    constructor() {
       // ... dentro del método run() de tu clase, después de obtener 'analysis'
       const findings = this.ruleEngine.execute(analysis);
       this.rulesReport.save(findings);
        super('DependencyRule', 'medium');
    }
    execute(report) {
        return report.dependencies
            .filter(item => item.dependencies.length > 30)
            .map(item => ({
                severity: this.severity,
                type: 'too-many-dependencies',
                file: item.file,
                recommendation: 'Separar responsabilidades y reducir acoplamiento.'
            }));
    }
}

module.exports = DependencyRule;