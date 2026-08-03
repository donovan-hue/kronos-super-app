'use strict';
const BaseRule = require('./BaseRule');

class ComplexityRule extends BaseRule {
    constructor() {
        super('ComplexityRule', 'medium');
    }
    execute(report) {
        return report.complexity
            .filter(item => item.functions > 50 || item.ifs > 100 || item.loops > 40)
            .map(item => ({
                severity: this.severity,
                type: 'high-complexity',
                file: item.file,
                recommendation: 'Reducir complejidad mediante extracción de funciones.'
            }));
    }
}

module.exports = ComplexityRule;