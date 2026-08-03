'use strict';

class PriorityManager {
    sort(tasks) {
        const weight = {
            high: 3,
            medium: 2,
            low: 1,
            info: 0
        };
        return tasks.sort((a, b) =>
            weight[b.priority] - weight[a.priority]
        );
    }
}

module.exports = PriorityManager;