'use strict';
const BaseTransformer = require('./BaseTransformer');

class FinalNewLineTransformer extends BaseTransformer {
    constructor() {
        super('FinalNewLine');
    }
    transform(source) {
        return source.endsWith('\n')
            ? source
            : source + '\n';
    }
}

module.exports = FinalNewLineTransformer;