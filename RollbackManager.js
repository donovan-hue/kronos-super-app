'use strict';
const fs = require('fs-extra');

class RollbackManager {
    restore(backup, destination) {
        fs.copyFileSync(
            backup,
            destination
        );
    }
}

module.exports = RollbackManager;