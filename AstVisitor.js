'use strict';

class AstVisitor {
    visit(ast, callback) {
        const walk = node => {
            if (!node || typeof node !== 'object') {
                return;
            }
            callback(node);
            Object.values(node).forEach(value => {
                if (Array.isArray(value)) {
                    value.forEach(walk);
                } else {
                    walk(value);
                }
            });
        };
        walk(ast);
    }
}

module.exports = AstVisitor;