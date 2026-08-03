'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants');

class RulesReport {
    save(report) {
        const output = path.join(
            constants.DIRECTORIES.REPORTS,
            'refactor-rules.json'
        );
        fs.writeJsonSync(output, report, { spaces: 4 });
        return output;
    }
}

module.exports = RulesReport;