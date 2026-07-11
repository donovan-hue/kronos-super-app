'use strict';

// Core Agent Modules (assuming these exist based on context)
const StaticAnalyzer = require('./StaticAnalyzer');
const RuleEngine = require('./RuleEngine');
const RulesReport = require('./RulesReport');
const StaticAnalysisReport = require('./StaticAnalysisReport');
const ExecutionPlanner = require('./ExecutionPlanner');
const ExecutionPlanReport = require('./ExecutionPlanReport');

// New Modules for Execution Engine (Paquete 6)
const ExecutionEngine = require('./server/orchestrator/refactor/execution/ExecutionEngine');
const ExecutionReport = require('./server/orchestrator/refactor/reports/ExecutionReport');
// New Modules for Automatic Refactoring Engine (Paquete 7)
const TransformerPipeline = require('./server/orchestrator/refactor/refactor/TransformerPipeline');
const RefactorEngine = require('./server/orchestrator/refactor/refactor/RefactorEngine');
// New Modules for Architecture Compliance Engine (Paquete 10)
const ArchitectureEngine = require('./server/orchestrator/refactor/architecture/ArchitectureEngine');
const ArchitectureReport = require('./server/orchestrator/refactor/reports/ArchitectureReport');
const architectureConfiguration = require('./server/orchestrator/refactor/architecture/architecture.config');


class KronosAgent {
    constructor() {
        // Paquete 3: Análisis estático
        this.staticAnalyzer = new StaticAnalyzer();
        // Paquete 4: Motor de reglas
        this.ruleEngine = new RuleEngine();
        this.rulesReport = new RulesReport();
        this.staticAnalysisReport = new StaticAnalysisReport();
        // Paquete 5: Planificador de refactorización
        this.executionPlanner = new ExecutionPlanner();
        this.executionPlanReport = new ExecutionPlanReport();
        // Paquete 6: Motor de Ejecución Transaccional
        this.executionEngine = new ExecutionEngine();
        // Paquete 7: Motor de Refactorización Automática
        this.pipeline = new TransformerPipeline();
        this.refactorEngine = new RefactorEngine(this.pipeline);
        this.executionReport = new ExecutionReport();
        // Paquete 10: Motor de Cumplimiento Arquitectónico
        this.architectureEngine = new ArchitectureEngine(architectureConfiguration);
        this.architectureReport = new ArchitectureReport();
        this.executionReport = new ExecutionReport();
    }

    async run(files) {
        const analysis = this.staticAnalyzer.execute(files);
        this.staticAnalysisReport.save(analysis);

        const findings = this.ruleEngine.execute(analysis);
        this.rulesReport.save(findings);

        const executionPlan = this.executionPlanner.build(findings);
        this.executionPlanReport.save(executionPlan);

        const refactorResult = this.refactorEngine.execute(files); // Assuming 'files' is the input for refactoring
        this.refactorReport.save(refactorResult);

        // Assuming 'discovery' (from Paquete 2) and 'quality' (from Paquete 9) are available here.
        // For this example, we'll use placeholder values or assume they are passed from previous steps.
        // The prompt states "Después del 'QualityEngine'", so 'quality' should be a result.
        // 'discovery' is from Paquete 2.
        const discovery = {}; // Placeholder for result from Paquete 2 (Project Discovery)
        const quality = {};   // Placeholder for result from Paquete 9 (Quality Engine)

        const architecture = this.architectureEngine.execute({
            analysis, discovery, quality
        });
        this.architectureReport.save(architecture);
        // Después de generar el plan de ejecución:
        const executionResult = await this.executionEngine.execute(executionPlan);
        this.executionReport.save(executionResult);

        console.log('Execution complete:', executionResult);
        return executionResult;
    }
}

// Example usage (assuming this is how the agent would be invoked)
// const agent = new KronosAgent();
// agent.run(someFilesArray).then(result => {
//     console.log('Agent finished with result:', result);
// }).catch(error => {
//     console.error('Agent encountered an error:', error);
// });

module.exports = KronosAgent;