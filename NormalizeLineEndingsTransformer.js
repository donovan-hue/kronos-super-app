'use strict';
const BaseTransformer = require('./BaseTransformer');

class NormalizeLineEndingsTransformer extends BaseTransformer {
    constructor() {
        super('NormalizeLineEndings');
    }
    transform(source) {
        return source.replace(/\r\n/g, '\n');
    }
}

module.exports = NormalizeLineEndingsTransformer;