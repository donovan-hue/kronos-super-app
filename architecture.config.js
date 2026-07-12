'use strict';

module.exports = {
    forbiddenDependencies: [
        'fs',
        'child_process'
    ],
    allowedLayers: [
        'presentation',
        'application',
        'domain',
        'infrastructure'
    ]
};