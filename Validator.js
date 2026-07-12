'use strict';

class Validator {
    async validate(task) {
        return {
            task: task.id,
            success: true,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = Validator;