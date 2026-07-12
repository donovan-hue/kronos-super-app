'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants');

class StaticAnalysisReport {
    save(report) {
        const file = path.join(
            constants.DIRECTORIES.REPORTS,
            'static-analysis.json'
        );
        fs.writeJsonSync(
            file,
            report,
            { spaces: 4 }
        );
        return file;
    }
}

module.exports = StaticAnalysisReport;