'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../../../constants');

class RefactorReport {
    save(report) {
        const output = path.join(
            constants.DIRECTORIES.REPORTS,
            'automatic-refactor-report.json'
        );
        fs.writeJsonSync(
            output,
            report,
            { spaces: 4 }
        );
        return output;
    }
}

module.exports = RefactorReport;