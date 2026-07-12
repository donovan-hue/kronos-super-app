'use strict';

class AstParser {
    constructor(adapter = null) {
        this.adapter = adapter;
    }

    parse(source, file) {
        if (!this.adapter) {
            return {
                type: 'VirtualAST',
                file: file.relative,
                source,
                nodes: []
            };
        }
        return this.adapter.parse(source);
    }
}

module.exports = AstParser;