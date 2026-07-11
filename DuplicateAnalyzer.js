'use strict';
const fs = require('fs-extra');
const crypto = require('crypto');

class DuplicateAnalyzer {
    hash(file) {
        return crypto
            .createHash('sha256')
            .update(
                fs.readFileSync(file.absolute)
            )
            .digest('hex');
    }

    analyze(files) {
        const hashes = {};
        const duplicates = [];
        files.forEach(file => {
            const hash = this.hash(file);
            if (hashes[hash]) {
                duplicates.push({
                    original: hashes[hash],
                    duplicate: file.relative
                });
            } else {
                hashes[hash] = file.relative;
            }
        });
        return duplicates;
    }
}

module.exports = DuplicateAnalyzer;