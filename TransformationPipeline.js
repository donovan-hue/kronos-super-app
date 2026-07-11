'use strict';
const fs = require('fs-extra');
const AstParser = require('./AstParser');
const AstVisitor = require('./AstVisitor');
const ImportOrganizer = require('./ImportOrganizer');
const DeadCodeDetector = require('./DeadCodeDetector');
const SymbolRenamer = require('./SymbolRenamer');

class TransformationPipeline {
    constructor(adapter = null) {
        this.parser = new AstParser(adapter);
        this.visitor = new AstVisitor();
        this.organizer = new ImportOrganizer();
        this.deadCode = new DeadCodeDetector();
        this.renamer = new SymbolRenamer();
    }

    execute(file) {
        const source = fs.readFileSync(
            file.absolute,
            'utf8'
        );
        const ast = this.parser.parse(
            source,
            file
        );
        const statistics = {
            nodes: 0
        };
        this.visitor.visit(ast, () => {
            statistics.nodes++;
        });
        return {
            file: file.relative,
            statistics,
            imports: this.organizer.execute(ast),
            deadCode: this.deadCode.analyze(ast)
        };
    }
}

module.exports = TransformationPipeline;