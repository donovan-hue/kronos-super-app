'use strict';

const fs = require('fs-extra');
const path = require('path');
// Assuming 'constants' module exists and exports 'DIRECTORIES.REPORTS'
const constants = require('../constants');

class ArchitectureReport {
    save(report) {
        const file = path.join(
            constants.DIRECTORIES.REPORTS,
            'architecture-report.json'
        );
        fs.writeJsonSync(
            file,
            report,
            { spaces: 4 }
        );
        return file;
    }
}

module.exports = ArchitectureReport;