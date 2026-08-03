'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../../../constants');

class AstTransformationReport {
    save(report) {
        const output = path.join(
            constants.DIRECTORIES.REPORTS,
            'ast-transformation-report.json'
        );
        fs.writeJsonSync(
            output,
            report,
            { spaces: 4 }
        );
        return output;
    }
}

module.exports = AstTransformationReport;