'use strict';

class DeadCodeDetector {
    analyze(ast) {
        return {
            unusedFunctions: [],
            unusedVariables: [],
            unreachableBlocks: [],
            ast
        };
    }
}

module.exports = DeadCodeDetector;