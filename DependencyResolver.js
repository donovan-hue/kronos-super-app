'use strict';

class DependencyResolver {
    resolve(tasks) {
        tasks.forEach((task, index) => {
            if (index === 0) {
                return;
            }
            task.dependencies.push(tasks[index - 1].id);
        });
        return tasks;
    }
}

module.exports = DependencyResolver;