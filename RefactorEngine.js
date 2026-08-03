'use strict';
class RefactorEngine {
    constructor(pipeline) {
        this.pipeline = pipeline;
    }
    execute(files) {
        const results = [];
        files.forEach(file => {
            results.push(
                this.pipeline.process(file)
            );
        });
        return {
            processedFiles: results.length,
            files: results,
            finishedAt: new Date().toISOString()
        };
    }
}

module.exports = RefactorEngine;