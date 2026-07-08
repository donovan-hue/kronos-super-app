# KRONOS backend agent system

The AI automation agents now live under this backend folder so the UI stays in the client workspace and business logic stays in the server workspace.

## Entry points

- `node server/agents/orchestrator.js`
- `node server/agents/kairos.js`
- `node server/agents/task-master.js`
- `node server/agents/builder-alpha.js`
- `node server/agents/pelos.js`

## Output files

- `server/agents/logs/orchestrator.log`
- `server/agents/logs/kairos-report.json`
- `server/agents/logs/kairos-study.md`
- `server/agents/tasks.json`
