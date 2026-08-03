'use strict';
const Task = require('./Task');

class TaskFactory {
    create(issue, index) {
        return new Task({
            id: `TASK-${String(index + 1).padStart(5, '0')}`,
            title: issue.type,
            description: issue.recommendation,
            priority: issue.severity,
            category: issue.type,
            risk: this.calculateRisk(issue),
            rollback: true,
            validation: [
                'Ejecutar pruebas.',
                'Validar compilación.',
                'Comparar diferencias.'
            ],
            data: issue
        });
    }
    calculateRisk(issue) {
        if (issue.severity === 'high') {
            return 'high';
        }
        if (issue.severity === 'medium') {
            return 'medium';
        }
        return 'low';
    }
}

module.exports = TaskFactory;