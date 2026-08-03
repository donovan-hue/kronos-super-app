'use strict';

class SymbolRenamer {
    rename(ast, oldName, newName) {
        return {
            modified: false,
            oldName,
            newName,
            ast
        };
    }
}

module.exports = SymbolRenamer;