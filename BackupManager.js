'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../../../constants'); // Adjusted path

class BackupManager {
    create(file) {
        const destination = path.join(
            constants.DIRECTORIES.BACKUPS,
            `${Date.now()}-${path.basename(file)}`
        );
        fs.ensureDirSync(constants.DIRECTORIES.BACKUPS);
        fs.copyFileSync(file, destination);
        return destination;
    }
}

module.exports = BackupManager;