'use strict';
const BaseRule = require('./BaseRule');

class DuplicateFilesRule extends BaseRule {
    constructor() {
        super('DuplicateFilesRule', 'high');
    }
    execute(report) {
        const issues = [];
        report.duplicates.forEach(item => {
            issues.push({
                severity: this.severity,
                type: 'duplicate-file',
                original: item.original,
                duplicate: item.duplicate,
                recommendation: 'Consolidar ambos archivos en una única implementación.'
            });
        });
        return issues;
    }
}

module.exports = DuplicateFilesRule;