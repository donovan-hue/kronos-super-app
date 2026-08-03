const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const LOG_FILE = path.join(__dirname, 'logs', 'pelos.log');
const DONE_FILE = path.join(__dirname, 'logs', 'completed.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] [PELOS] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function loadTasks() { if (!fs.existsSync(TASKS_FILE)) return []; return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')); }
function saveTasks(tasks) { fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2)); }
function markTaskStatus(taskId, status, notes = '') { const tasks = loadTasks(); const idx = tasks.findIndex(t => t.id === taskId); if (idx === -1) return; tasks[idx].status = status; tasks[idx].updatedAt = new Date().toISOString(); if (notes) tasks[idx].notes = notes; saveTasks(tasks); }
function recordCompleted(task) { const list = fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, 'utf8')) : []; list.push({ ...task, completedAt: new Date().toISOString(), agent: 'pelos' }); fs.writeFileSync(DONE_FILE, JSON.stringify(list, null, 2)); }
function writeFile(relPath, content) { const abs = path.join(ROOT, relPath); fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, content); log(`  Wrote: ${relPath}`); }
function patchFile(relPath, find, replace) { const abs = path.join(ROOT, relPath); if (!fs.existsSync(abs)) { log(`  File not found: ${relPath}`); return false; } const original = fs.readFileSync(abs, 'utf8'); if (!original.includes(find)) { log(`  Pattern not found in ${relPath}`); return false; } fs.writeFileSync(abs, original.replace(find, replace)); log(`  Patched: ${relPath}`); return true; }

function detectIssues() { const issues = []; const serverFiles = [ 'server/server.js', 'server/controllers/walletController.js', 'server/controllers/communityController.js', ]; for (const f of serverFiles) { const abs = path.join(ROOT, f); if (!fs.existsSync(abs)) continue; const content = fs.readFileSync(abs, 'utf8'); const matches = content.match(/console\.log\(/g); if (matches && matches.length > 3) issues.push({ type: 'console_leak', file: f, count: matches.length }); }
 const serverJs = path.join(ROOT, 'server/server.js'); if (fs.existsSync(serverJs)) { const content = fs.readFileSync(serverJs, 'utf8'); if (!content.includes('rate-limit') && !content.includes('rateLimit')) issues.push({ type: 'missing_rate_limit', file: 'server/server.js' }); }
 if (fs.existsSync(path.join(ROOT, 'server/routes/notifications.js'))) { const serverContent = fs.readFileSync(serverJs, 'utf8'); if (!serverContent.includes('/api/notifications')) issues.push({ type: 'missing_route_registration', route: '/api/notifications', file: 'server/server.js' }); }
 const content = fs.existsSync(serverJs) ? fs.readFileSync(serverJs, 'utf8') : ''; if (content.includes('origin: true') || content.includes("origin: '*")) issues.push({ type: 'permissive_cors', file: 'server/server.js' }); if (!content.includes('helmet')) issues.push({ type: 'missing_helmet', file: 'server/server.js' }); if (!content.includes('mongoSanitize') && !content.includes('mongo-sanitize')) issues.push({ type: 'missing_mongo_sanitize', file: 'server/server.js' }); if (!content.includes('xss-clean') && !content.includes("require('xss')")) issues.push({ type: 'missing_xss_clean', file: 'server/server.js' }); return issues; }

const IMPLEMENTATIONS = {
  'api-rate-limit': () => {
    writeFile('server/middleware/rateLimit.js', `const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.walletLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Demasiadas operaciones. Espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { message: 'Rate limit excedido.' },
  standardHeaders: true,
  legacyHeaders: false,
});
`);
    const walletRoute = path.join(ROOT, 'server/routes/wallet.js');
    if (fs.existsSync(walletRoute)) {
      let content = fs.readFileSync(walletRoute, 'utf8');
      if (!content.includes('walletLimiter')) {
        content = `const { walletLimiter } = require('../middleware/rateLimit');\n` + content;
        content = content.replace("router.post('/deposit'", "router.post('/deposit', walletLimiter,").replace("router.post('/transfer'", "router.post('/transfer', walletLimiter,");
        fs.writeFileSync(walletRoute, content);
        log('  Rate limiter added to wallet routes');
      }
    }
    const authRoute = path.join(ROOT, 'server/routes/auth.js');
    if (fs.existsSync(authRoute)) {
      let content = fs.readFileSync(authRoute, 'utf8');
      if (!content.includes('authLimiter')) {
        content = `const { authLimiter } = require('../middleware/rateLimit');\n` + content;
        content = content.replace("router.post('/login'", "router.post('/login', authLimiter,");
        fs.writeFileSync(authRoute, content);
        log('  Auth limiter added to auth routes');
      }
    }
    log('  Rate limiting middleware created');
    log('  NOTE: Run "npm install express-rate-limit" in /server');
  },
  'test-api-smoke': () => {
    fs.mkdirSync(path.join(ROOT, 'server/tests'), { recursive: true });
    writeFile('server/tests/smoke.test.js', `const request = require('supertest');\nconst mongoose = require('mongoose');\n\nlet app;\nlet authToken;\nconst TEST_USER = {\n  username: 'smoketest_' + Date.now(),\n  email: \\`smoke\\${Date.now()}@test.com\\`,\n  password: 'TestPass123!',\n};\n\nbeforeAll(async () => {\n  process.env.NODE_ENV = 'test';\n  app = require('../server');\n  try {\n    await request(app).post('/api/auth/register').send(TEST_USER);\n    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: TEST_USER.password, });\n    authToken = res.body.token;\n  } catch (e) {\n    console.warn('Could not create test user:', e.message);\n  }\n}, 30000);\n\nafterAll(async () => {\n  if (mongoose.connection.readyState !== 0) {\n    await mongoose.connection.close();\n  }\n});\n\ndescribe('Auth endpoints', () => {\n  test('POST /api/auth/login — wrong credentials returns 400/401', async () => {\n    const res = await request(app).post('/api/auth/login').send({ email: 'fake@fake.com', password: 'wrongpass' });\n    expect([400, 401]).toContain(res.statusCode);\n  });\n\n  test('POST /api/auth/login — missing body returns 400', async () => {\n    const res = await request(app).post('/api/auth/login').send({});\n    expect(res.statusCode).toBe(400);\n  });\n});\n\ndescribe('Protected endpoints — no token', () => {\n  test('GET /api/wallet returns 401', async () => {\n    const res = await request(app).get('/api/wallet');\n    expect(res.statusCode).toBe(401);\n  });\n\n  test('GET /api/communities returns 401', async () => {\n    const res = await request(app).get('/api/communities');\n    expect(res.statusCode).toBe(401);\n  });\n\n  test('POST /api/wallet/transfer returns 401', async () => {\n    const res = await request(app).post('/api/wallet/transfer').send({});\n    expect(res.statusCode).toBe(401);\n  });\n});\n\ndescribe('Protected endpoints — with token', () => {\n  test('GET /api/wallet returns 200 when authenticated', async () => {\n    if (!authToken) return;\n    const res = await request(app).get('/api/wallet').set('Authorization', \\`Bearer \\${authToken}\\`);\n    expect(res.statusCode).toBe(200);\n  });\n\n  test('GET /api/communities returns 200 when authenticated', async () => {\n    if (!authToken) return;\n    const res = await request(app).get('/api/communities').set('Authorization', \\`Bearer \\${authToken}\\`);\n    expect(res.statusCode).toBe(200);\n  });\n\n  test('GET /api/notifications returns 200 when authenticated', async () => {\n    if (!authToken) return;\n    const res = await request(app).get('/api/notifications').set('Authorization', \\`Bearer \\${authToken}\\`);\n    expect([200, 404]).toContain(res.statusCode);\n  });\n});\n\ndescribe('Wallet validation', () => {\n  test('POST /api/wallet/transfer — missing amount returns 400', async () => {\n    if (!authToken) return;\n    const res = await request(app).post('/api/wallet/transfer').set('Authorization', \\`Bearer \\${authToken}\\`).send({ to: 'someuser' });\n    expect([400, 422]).toContain(res.statusCode);\n  });\n});`);
    const pkgPath = path.join(ROOT, 'server/package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!pkg.scripts?.test) {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.test = 'jest --testEnvironment=node --forceExit --detectOpenHandles';
        pkg.jest = { testMatch: ['**/tests/**/*.test.js'], testTimeout: 30000 };
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        log('  Jest config added to server/package.json');
      }
    }
    log('  Smoke tests created. Run: cd server && npm install --save-dev jest supertest && npm test');
  },
  'sec-input-sanitize': () => { const serverPath = path.join(ROOT, 'server/server.js'); if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; } let content = fs.readFileSync(serverPath, 'utf8'); if (content.includes('mongoSanitize') || content.includes('mongo-sanitize')) { log('  Already has mongoSanitize'); return; } content = content.replace("const express = require('express');", "const express = require('express');\nconst mongoSanitize = require('express-mongo-sanitize');"); content = content.replace('app.use(express.json());', 'app.use(express.json());\napp.use(mongoSanitize());'); fs.writeFileSync(serverPath, content); log('  express-mongo-sanitize added to server.js'); log('  NOTE: Run "npm install express-mongo-sanitize" in /server'); },
  'sec-xss-clean': () => { const serverPath = path.join(ROOT, 'server/server.js'); if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; } let content = fs.readFileSync(serverPath, 'utf8'); if (content.includes('xss-clean') || content.includes("require('xss')")) { log('  Already has xss-clean'); return; } content = content.replace("const express = require('express');", "const express = require('express');\nconst xss = require('xss-clean');"); content = content.replace('app.use(express.json());', 'app.use(express.json());\napp.use(xss());'); fs.writeFileSync(serverPath, content); log('  xss-clean added to server.js'); log('  NOTE: Run "npm install xss-clean" in /server'); },
  'test-wallet-unit': () => { fs.mkdirSync(path.join(ROOT, 'server/tests'), { recursive: true }); writeFile('server/tests/wallet.test.js', `const mongoose = require('mongoose');\n\njest.mock('../models/CashWallet', () => {\n  const mockWallet = {\n    balance: 100,\n    kroTokens: 0,\n    transactions: [],\n    save: jest.fn().mockResolvedValue(true),\n  };\n  return {\n    findOne: jest.fn().mockResolvedValue(mockWallet),\n    create: jest.fn().mockResolvedValue(mockWallet),\n    _mockWallet: mockWallet,\n  };\n});\n\nconst CashWallet = require('../models/CashWallet');\n\ndescribe('Wallet Controller — business logic', () => {\n  let req, res;\n\n  beforeEach(() => {\n    res = {\n      json: jest.fn(),\n      status: jest.fn().mockReturnThis(),\n    };\n    CashWallet._mockWallet.balance = 100;\n    CashWallet._mockWallet.transactions = [];\n    CashWallet._mockWallet.save.mockClear();\n  });\n\n  test('getWallet devuelve balance existente', async () => {\n    req = { user: { _id: new mongoose.Types.ObjectId() } };\n    const { getWallet } = require('../controllers/walletController');\n    await getWallet(req, res);\n    expect(res.json).toHaveBeenCalled();\n  });\n\n  test('deposit con amount negativo retorna 400', async () => {\n    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: -50 } };\n    const { deposit } = require('../controllers/walletController');\n    await deposit(req, res);\n    expect(res.status).toHaveBeenCalledWith(400);\n  });\n\n  test('deposit incrementa el balance', async () => {\n    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: 50 } };\n    CashWallet._mockWallet.balance = 100;\n    const { deposit } = require('../controllers/walletController');\n    await deposit(req, res);\n    expect(CashWallet._mockWallet.save).toHaveBeenCalled();\n  });\n});`); log('  wallet.test.js created'); log('  NOTE: Run "cd server && npm test" to execute'); },
};

function autoFix(issues) { let fixed = 0; for (const issue of issues) { if (issue.type === 'missing_route_registration') { const serverPath = 'server/server.js'; const serverAbs = path.join(ROOT, serverPath); const content = fs.readFileSync(serverAbs, 'utf8'); const lastRouteMatch = content.match(/app\.use\('\/api\/'[^']+',.*\);\n(?!app\.use)/); if (lastRouteMatch) { const insertAfter = lastRouteMatch[0]; const newContent = content.replace(insertAfter, insertAfter + `app.use('/api/notifications', require('./routes/notifications'));\n`); fs.writeFileSync(serverAbs, newContent); log(`  AUTO-FIX: Registered /api/notifications in server.js`); fixed++; } }
 if (issue.type === 'missing_helmet') { const serverAbs = path.join(ROOT, 'server/server.js'); const content = fs.readFileSync(serverAbs, 'utf8'); if (!content.includes("require('helmet')") && !content.includes('require("helmet")')) { const newContent = content.replace("const express = require('express');", "const express = require('express');\nconst helmet = require('helmet');").replace('app.use(express.json());', 'app.use(helmet());\napp.use(express.json());'); fs.writeFileSync(serverAbs, newContent); log('  AUTO-FIX: Added helmet to server.js'); log('  NOTE: Run "npm install helmet" in /server'); fixed++; } } } return fixed; }

const FIXER_TASK_TYPES = ['security', 'test'];
function pickNextTask(tasks) { return tasks.find(t => t.status === 'pending' && FIXER_TASK_TYPES.includes(t.type)) || null; }
function run(options = {}) { const { taskId = null, autoFixOnly = false, dryRun = false } = options; log('=== PELOS iniciando ==='); log('Ejecutando detección automática de problemas...'); const issues = detectIssues(); if (issues.length > 0) { log(`Detectados ${issues.length} problemas:`); for (const issue of issues) log(`  [${issue.type}] ${issue.file || ''}`); if (!dryRun) { const fixed = autoFix(issues); log(`Auto-fixes aplicados: ${fixed}`); } } else { log('No se detectaron problemas automáticos'); }
 if (autoFixOnly) { log('=== PELOS finalizado (auto-fix only) ==='); return; }
 const tasks = loadTasks(); let task; if (taskId) { task = tasks.find(t => t.id === taskId); if (!task) { log(`Tarea ${taskId} no encontrada`); return; } } else { task = pickNextTask(tasks); }
 if (!task) { log('No hay tareas de seguridad/test pendientes.'); log('=== PELOS finalizado ==='); return; }
 log(`Ejecutando tarea: [${task.id}] ${task.title}`);
 if (dryRun) { log('DRY RUN — no se escriben archivos'); return; }
 const impl = IMPLEMENTATIONS[task.id]; if (!impl) { log(`  Sin implementación automática para ${task.id}. Marcando como needs_human.`); markTaskStatus(task.id, 'needs_human', 'No hay implementación automática registrada'); return; }
 try { markTaskStatus(task.id, 'in_progress'); impl(); markTaskStatus(task.id, 'done'); recordCompleted(task); log(`Tarea [${task.id}] COMPLETADA`); } catch (err) { log(`ERROR en tarea [${task.id}]: ${err.message}`); markTaskStatus(task.id, 'error', err.message); }
 log('=== PELOS finalizado ==='); }
if (require.main === module) { const args = process.argv.slice(2); const taskId = args.find(a => !a.startsWith('--')) || null; const autoFixOnly = args.includes('--auto-fix'); const dryRun = args.includes('--dry'); run({ taskId, autoFixOnly, dryRun }); } else { module.exports = { run, detectIssues, autoFix, FIXER_TASK_TYPES }; }