'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../../../constants'); // Adjusted path

class ExecutionReport {
    save(report) {
        const file = path.join(
            constants.DIRECTORIES.REPORTS,
            'execution-engine-report.json'
        );
        fs.writeJsonSync(
            file,
            report,
            { spaces: 4 }
        );
        return file;
    }
}

module.exports = ExecutionReport;