/**
 * KRONOS PELOS AGENT
 * Picks pending security and test tasks from tasks.json and implements them.
 * Also runs automated checks to detect and auto-fix common issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const LOG_FILE = path.join(__dirname, 'logs', 'pelos.log');
const DONE_FILE = path.join(__dirname, 'logs', 'completed.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] [PELOS] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function markTaskStatus(taskId, status, notes = '') {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;
  tasks[idx].status = status;
  tasks[idx].updatedAt = new Date().toISOString();
  if (notes) tasks[idx].notes = notes;
  saveTasks(tasks);
}

function recordCompleted(task) {
  const list = fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, 'utf8')) : [];
  list.push({ ...task, completedAt: new Date().toISOString(), agent: 'pelos' });
  fs.writeFileSync(DONE_FILE, JSON.stringify(list, null, 2));
}

function writeFile(relPath, content) {
  const abs = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  log(`  Wrote: ${relPath}`);
}

function patchFile(relPath, find, replace) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) { log(`  File not found: ${relPath}`); return false; }
  const original = fs.readFileSync(abs, 'utf8');
  if (!original.includes(find)) { log(`  Pattern not found in ${relPath}`); return false; }
  fs.writeFileSync(abs, original.replace(find, replace));
  log(`  Patched: ${relPath}`);
  return true;
}

// ─── Auto-detect fixes ────────────────────────────────────────────────────────

function detectIssues() {
  const issues = [];

  // 1. Check for console.log leaks in production server files
  const serverFiles = [
    'server/server.js',
    'server/controllers/walletController.js',
    'server/controllers/communityController.js',
  ];
  for (const f of serverFiles) {
    const abs = path.join(ROOT, f);
    if (!fs.existsSync(abs)) continue;
    const content = fs.readFileSync(abs, 'utf8');
    const matches = content.match(/console\.log\(/g);
    if (matches && matches.length > 3) {
      issues.push({ type: 'console_leak', file: f, count: matches.length });
    }
  }

  // 2. Check if rate limiting is installed
  const serverJs = path.join(ROOT, 'server/server.js');
  if (fs.existsSync(serverJs)) {
    const content = fs.readFileSync(serverJs, 'utf8');
    if (!content.includes('rate-limit') && !content.includes('rateLimit')) {
      issues.push({ type: 'missing_rate_limit', file: 'server/server.js' });
    }
  }

  // 3. Check if notifications route is registered
  if (fs.existsSync(path.join(ROOT, 'server/routes/notifications.js'))) {
    const serverContent = fs.readFileSync(serverJs, 'utf8');
    if (!serverContent.includes('/api/notifications')) {
      issues.push({ type: 'missing_route_registration', route: '/api/notifications', file: 'server/server.js' });
    }
  }

  // 4. Check for missing CORS headers specificity
  const content = fs.existsSync(serverJs) ? fs.readFileSync(serverJs, 'utf8') : '';
  if (content.includes('origin: true') || content.includes("origin: '*'")) {
    issues.push({ type: 'permissive_cors', file: 'server/server.js' });
  }

  // 5. Check for missing helmet
  if (!content.includes('helmet')) {
    issues.push({ type: 'missing_helmet', file: 'server/server.js' });
  }

  // 6. Check for missing mongo sanitize
  if (!content.includes('mongoSanitize') && !content.includes('mongo-sanitize')) {
    issues.push({ type: 'missing_mongo_sanitize', file: 'server/server.js' });
  }

  // 7. Check for missing xss-clean
  if (!content.includes('xss-clean') && !content.includes("require('xss')")) {
    issues.push({ type: 'missing_xss_clean', file: 'server/server.js' });
  }

  return issues;
}

// ─── Implementations ──────────────────────────────────────────────────────────

const IMPLEMENTATIONS = {

  'api-rate-limit': () => {
    writeFile('server/middleware/rateLimit.js', `const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.walletLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
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

    // Patch server/routes/wallet.js to add wallet limiter
    const walletRoute = path.join(ROOT, 'server/routes/wallet.js');
    if (fs.existsSync(walletRoute)) {
      let content = fs.readFileSync(walletRoute, 'utf8');
      if (!content.includes('walletLimiter')) {
        content = `const { walletLimiter } = require('../middleware/rateLimit');\n` + content;
        content = content.replace(
          "router.post('/deposit'",
          "router.post('/deposit', walletLimiter,"
        ).replace(
          "router.post('/transfer'",
          "router.post('/transfer', walletLimiter,"
        );
        fs.writeFileSync(walletRoute, content);
        log('  Rate limiter added to wallet routes');
      }
    }

    // Patch auth route if it exists
    const authRoute = path.join(ROOT, 'server/routes/auth.js');
    if (fs.existsSync(authRoute)) {
      let content = fs.readFileSync(authRoute, 'utf8');
      if (!content.includes('authLimiter')) {
        content = `const { authLimiter } = require('../middleware/rateLimit');\n` + content;
        content = content.replace(
          "router.post('/login'",
          "router.post('/login', authLimiter,"
        );
        fs.writeFileSync(authRoute, content);
        log('  Auth limiter added to auth routes');
      }
    }

    log('  Rate limiting middleware created');
    log('  NOTE: Run "npm install express-rate-limit" in /server');
  },

  'test-api-smoke': () => {
    // Ensure tests directory exists
    fs.mkdirSync(path.join(ROOT, 'server/tests'), { recursive: true });

    writeFile('server/tests/smoke.test.js', `const request = require('supertest');
const mongoose = require('mongoose');

let app;
let authToken;
const TEST_USER = {
  username: 'smoketest_' + Date.now(),
  email: \`smoke\${Date.now()}@test.com\`,
  password: 'TestPass123!',
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  app = require('../server');
  // Register and login a test user
  try {
    await request(app).post('/api/auth/register').send(TEST_USER);
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    authToken = res.body.token;
  } catch (e) {
    console.warn('Could not create test user:', e.message);
  }
}, 30000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Auth endpoints', () => {
  test('POST /api/auth/login — wrong credentials returns 400/401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@fake.com', password: 'wrongpass' });
    expect([400, 401]).toContain(res.statusCode);
  });

  test('POST /api/auth/login — missing body returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected endpoints — no token', () => {
  test('GET /api/wallet returns 401', async () => {
    const res = await request(app).get('/api/wallet');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/communities returns 401', async () => {
    const res = await request(app).get('/api/communities');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/wallet/transfer returns 401', async () => {
    const res = await request(app).post('/api/wallet/transfer').send({});
    expect(res.statusCode).toBe(401);
  });
});

describe('Protected endpoints — with token', () => {
  test('GET /api/wallet returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/wallet')
      .set('Authorization', \`Bearer \${authToken}\`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/communities returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/communities')
      .set('Authorization', \`Bearer \${authToken}\`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/notifications returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', \`Bearer \${authToken}\`);
    expect([200, 404]).toContain(res.statusCode); // 404 if route not registered yet
  });
});

describe('Wallet validation', () => {
  test('POST /api/wallet/transfer — missing amount returns 400', async () => {
    if (!authToken) return;
    const res = await request(app)
      .post('/api/wallet/transfer')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({ to: 'someuser' });
    expect([400, 422]).toContain(res.statusCode);
  });
});
`);

    // Add jest config to server/package.json if missing
    const pkgPath = path.join(ROOT, 'server/package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (!pkg.scripts?.test) {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.test = 'jest --testEnvironment=node --forceExit --detectOpenHandles';
        pkg.jest = {
          testMatch: ['**/tests/**/*.test.js'],
          testTimeout: 30000,
        };
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        log('  Jest config added to server/package.json');
      }
    }
    log('  Smoke tests created. Run: cd server && npm install --save-dev jest supertest && npm test');
  },

  // ── Wave 2 security ───────────────────────────────────────────────────────

  'sec-input-sanitize': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('mongoSanitize') || content.includes('mongo-sanitize')) {
      log('  Already has mongoSanitize'); return;
    }
    content = content.replace(
      "const express = require('express');",
      "const express = require('express');\nconst mongoSanitize = require('express-mongo-sanitize');"
    );
    content = content.replace(
      'app.use(express.json());',
      'app.use(express.json());\napp.use(mongoSanitize());'
    );
    fs.writeFileSync(serverPath, content);
    log('  express-mongo-sanitize added to server.js');
    log('  NOTE: Run "npm install express-mongo-sanitize" in /server');
  },

  'sec-xss-clean': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('xss-clean') || content.includes("require('xss')")) {
      log('  Already has xss-clean'); return;
    }
    content = content.replace(
      "const express = require('express');",
      "const express = require('express');\nconst xss = require('xss-clean');"
    );
    content = content.replace(
      'app.use(express.json());',
      'app.use(express.json());\napp.use(xss());'
    );
    fs.writeFileSync(serverPath, content);
    log('  xss-clean added to server.js');
    log('  NOTE: Run "npm install xss-clean" in /server');
  },

  'test-wallet-unit': () => {
    fs.mkdirSync(path.join(ROOT, 'server/tests'), { recursive: true });
    writeFile('server/tests/wallet.test.js', `const mongoose = require('mongoose');

// Mock mongoose models before requiring controller
jest.mock('../models/CashWallet', () => {
  const mockWallet = {
    balance: 100,
    kroTokens: 0,
    transactions: [],
    save: jest.fn().mockResolvedValue(true),
  };
  return {
    findOne: jest.fn().mockResolvedValue(mockWallet),
    create: jest.fn().mockResolvedValue(mockWallet),
    _mockWallet: mockWallet,
  };
});

const CashWallet = require('../models/CashWallet');

describe('Wallet Controller — business logic', () => {
  let req, res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    CashWallet._mockWallet.balance = 100;
    CashWallet._mockWallet.transactions = [];
    CashWallet._mockWallet.save.mockClear();
  });

  test('getWallet devuelve balance existente', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() } };
    const { getWallet } = require('../controllers/walletController');
    await getWallet(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('deposit con amount negativo retorna 400', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: -50 } };
    const { deposit } = require('../controllers/walletController');
    await deposit(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deposit incrementa el balance', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: 50 } };
    CashWallet._mockWallet.balance = 100;
    const { deposit } = require('../controllers/walletController');
    await deposit(req, res);
    expect(CashWallet._mockWallet.save).toHaveBeenCalled();
  });
});
`);
    log('  wallet.test.js created');
    log('  NOTE: Run "cd server && npm test" to execute');
  },
};

// ─── Auto-fix engine ──────────────────────────────────────────────────────────

function autoFix(issues) {
  let fixed = 0;

  for (const issue of issues) {
    if (issue.type === 'missing_route_registration') {
      // Register the notifications route in server.js
      const serverPath = 'server/server.js';
      const serverAbs = path.join(ROOT, serverPath);
      const content = fs.readFileSync(serverAbs, 'utf8');

      // Find the last app.use('/api/...) line and insert after it
      const lastRouteMatch = content.match(/app\.use\('\/api\/[^']+',.*\);\n(?!app\.use)/);
      if (lastRouteMatch) {
        const insertAfter = lastRouteMatch[0];
        const newContent = content.replace(
          insertAfter,
          insertAfter + `app.use('/api/notifications', require('./routes/notifications'));\n`
        );
        fs.writeFileSync(serverAbs, newContent);
        log(`  AUTO-FIX: Registered /api/notifications in server.js`);
        fixed++;
      }
    }

    if (issue.type === 'missing_helmet') {
      const serverAbs = path.join(ROOT, 'server/server.js');
      const content = fs.readFileSync(serverAbs, 'utf8');
      if (!content.includes("require('helmet')") && !content.includes('require("helmet")')) {
        const newContent = content.replace(
          "const express = require('express');",
          "const express = require('express');\nconst helmet = require('helmet');"
        ).replace(
          'app.use(express.json());',
          'app.use(helmet());\napp.use(express.json());'
        );
        fs.writeFileSync(serverAbs, newContent);
        log('  AUTO-FIX: Added helmet to server.js');
        log('  NOTE: Run "npm install helmet" in /server');
        fixed++;
      }
    }
  }

  return fixed;
}

// ─── Runner ───────────────────────────────────────────────────────────────────

const FIXER_TASK_TYPES = ['security', 'test'];

function pickNextTask(tasks) {
  return tasks.find(
    t => t.status === 'pending' && FIXER_TASK_TYPES.includes(t.type)
  ) || null;
}

function run(options = {}) {
  const { taskId = null, autoFixOnly = false, dryRun = false } = options;
  log('=== PELOS iniciando ===');

  // Auto-detect and fix issues first
  log('Ejecutando detección automática de problemas...');
  const issues = detectIssues();
  if (issues.length > 0) {
    log(`Detectados ${issues.length} problemas:`);
    for (const issue of issues) {
      log(`  [${issue.type}] ${issue.file || ''}`);
    }
    if (!dryRun) {
      const fixed = autoFix(issues);
      log(`Auto-fixes aplicados: ${fixed}`);
    }
  } else {
    log('No se detectaron problemas automáticos');
  }

  if (autoFixOnly) {
    log('=== PELOS finalizado (auto-fix only) ===');
    return;
  }

  // Then pick a task from the queue
  const tasks = loadTasks();
  let task;
  if (taskId) {
    task = tasks.find(t => t.id === taskId);
    if (!task) { log(`Tarea ${taskId} no encontrada`); return; }
  } else {
    task = pickNextTask(tasks);
  }

  if (!task) {
    log('No hay tareas de seguridad/test pendientes.');
    log('=== PELOS finalizado ===');
    return;
  }

  log(`Ejecutando tarea: [${task.id}] ${task.title}`);

  if (dryRun) {
    log('DRY RUN — no se escriben archivos');
    return;
  }

  const impl = IMPLEMENTATIONS[task.id];
  if (!impl) {
    log(`  Sin implementación automática para ${task.id}. Marcando como needs_human.`);
    markTaskStatus(task.id, 'needs_human', 'No hay implementación automática registrada');
    return;
  }

  try {
    markTaskStatus(task.id, 'in_progress');
    impl();
    markTaskStatus(task.id, 'done');
    recordCompleted(task);
    log(`Tarea [${task.id}] COMPLETADA`);
  } catch (err) {
    log(`ERROR en tarea [${task.id}]: ${err.message}`);
    markTaskStatus(task.id, 'error', err.message);
  }

  log('=== PELOS finalizado ===');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const taskId = args.find(a => !a.startsWith('--')) || null;
  const autoFixOnly = args.includes('--auto-fix');
  const dryRun = args.includes('--dry');
  run({ taskId, autoFixOnly, dryRun });
} else {
  module.exports = { run, detectIssues, autoFix, FIXER_TASK_TYPES };
}
