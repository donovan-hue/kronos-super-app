'use strict';
const fs = require('fs-extra');

class ComplexityAnalyzer {
    analyze(file) {
        const source = fs.readFileSync(file.absolute, 'utf8');
        return {
            file: file.relative,
            lines: source.split('\n').length,
            functions: (source.match(/function\s+/g) || []).length,
            classes: (source.match(/class\s+/g) || []).length,
            ifs: (source.match(/\bif\b/g) || []).length,
            loops:
                (source.match(/\bfor\b/g) || []).length +
                (source.match(/\bwhile\b/g) || []).length
        };
    }
}

module.exports = ComplexityAnalyzer;