'use strict';
const fs = require('fs-extra');
const RemoveTrailingSpacesTransformer =    require('./RemoveTrailingSpacesTransformer');
const NormalizeLineEndingsTransformer =    require('./NormalizeLineEndingsTransformer');
const FinalNewLineTransformer =    require('./FinalNewLineTransformer');

class TransformerPipeline {
    constructor() {
        this.transformers = [
            new NormalizeLineEndingsTransformer(),
            new RemoveTrailingSpacesTransformer(),
            new FinalNewLineTransformer()
        ];
    }
    process(file) {
        let source = fs.readFileSync(
            file.absolute,
            'utf8'
        );
        this.transformers.forEach(transformer => {
            if (transformer.supports(file)) {
                source = transformer.transform(
                    source,
                    file
                );
            }
        });
        fs.writeFileSync(
            file.absolute,
            source,
            'utf8'
        );
        return {
            file: file.relative,
            transformers: this.transformers.map(t => t.name)
        };
    }
}

module.exports = TransformerPipeline;