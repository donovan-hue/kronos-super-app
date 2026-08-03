'use strict';
const fs = require('fs-extra');

class DependencyAnalyzer {
    constructor() {
        this.patterns = [
            /require\(['"`](.*?)['"`]\)/g,
            /import\s+.*?\s+from\s+'"`['"`]/g,
            /import\('"`['"`]\)/g
        ];
    }

    analyze(file) {
        const content = fs.readFileSync(file.absolute, 'utf8');
        const dependencies = [];
        this.patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                dependencies.push(match[1]);
            }
        });
        return {
            file: file.relative,
            dependencies
        };
    }
}

module.exports = DependencyAnalyzer;