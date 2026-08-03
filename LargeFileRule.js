'use strict';
const BaseRule = require('./BaseRule');

class LargeFileRule extends BaseRule {
    constructor() {
        super('LargeFileRule', 'medium');
    }
    execute(report) {
        return report.complexity
            .filter(item => item.lines > 500)
            .map(item => ({
                severity: this.severity,
                type: 'large-file',
                file: item.file,
                recommendation: 'Dividir el archivo en módulos más pequeños.'
            }));
    }
}

module.exports = LargeFileRule;