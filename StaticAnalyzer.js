'use strict';
const DependencyAnalyzer = require('./DependencyAnalyzer');
const ComplexityAnalyzer = require('./ComplexityAnalyzer');
const DuplicateAnalyzer = require('./DuplicateAnalyzer');

class StaticAnalyzer {
    constructor() {
        this.dependencies = new DependencyAnalyzer();
        this.complexity = new ComplexityAnalyzer();
        this.duplicates = new DuplicateAnalyzer();
    }

    execute(files) {
        const dependencyReport = [];
        const complexityReport = [];
        files.forEach(file => {
            dependencyReport.push(
                this.dependencies.analyze(file)
            );
            complexityReport.push(
                this.complexity.analyze(file)
            );
        });
        const duplicates =
            this.duplicates.analyze(files);
        return {
            dependencies: dependencyReport,
            complexity: complexityReport,
            duplicates
        };
    }
}

module.exports = StaticAnalyzer;