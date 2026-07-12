const ExecutionPlanner = require('./refactor/planner/ExecutionPlanner');
const ExecutionPlanReport = require('./refactor/reports/ExecutionPlanReport');
// ... dentro del método run() de tu clase, después de obtener 'findings'
const executionPlan = this.executionPlanner.build(findings);
this.executionPlanReport.save(executionPlan);
'use strict';
const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants');

class ExecutionPlanReport {
    save(plan) {
        const output = path.join(
            constants.DIRECTORIES.REPORTS,
            'execution-plan.json'
        );
        fs.writeJsonSync(output, plan, { spaces: 4 });
        return output;
    }
}

module.exports = ExecutionPlanReport;