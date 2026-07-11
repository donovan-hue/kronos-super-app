)'use strict';
const BaseTransformer = require('./BaseTransformer');

class RemoveTrailingSpacesTransformer extends BaseTransformer {
    constructor() {
        super('RemoveTrailingSpaces');
    }
    transform(source) {
        return source
            .split('\n')
            .map(line => line.replace(/\s+$/g, ''))
            .join('\n');
    }
}

module.exports = RemoveTrailingSpacesTransformer;