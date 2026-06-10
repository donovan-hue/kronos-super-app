/**
 * KRONOS · KAIROS — ARQUITECTO EXPERTO DEL PROYECTO
 * ────────────────────────────────────────────────────────────────────────────
 * Agente experto en TODO lo que es y conlleva KRONOS (red social + e-commerce +
 * delivery + wallet/token + IA + web3). Su trabajo es responder una sola pregunta:
 *
 *      «¿Qué le hace falta a KRONOS para estar funcionando en la web?»
 *
 * Audita el proyecto de punta a punta — variables de entorno, despliegue
 * (Render + Vercel), cableado de rutas, integraciones (Stripe, Cloudinary,
 * OpenAI, DeepL, Web3, Push, Email, OAuth) y páginas del cliente — produce un
 * informe claro por severidad, encola tareas accionables en tasks.json para que
 * Builder Alpha / Pelos las implementen, y arregla por sí mismo lo que es seguro
 * automatizar (registrar rutas huérfanas, sincronizar la documentación de envs).
 *
 * Uso:
 *   node agents/kairos.js              → auditoría + informe + encola tareas
 *   node agents/kairos.js --report     → solo informe en consola (no escribe nada)
 *   node agents/kairos.js --fix        → además aplica los auto-fixes seguros
 *   node agents/kairos.js --json       → vuelca el informe como JSON
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const LOG_FILE = path.join(__dirname, 'logs', 'kairos.log');
const REPORT_FILE = path.join(__dirname, 'logs', 'kairos-report.json');

// ─── Utilidades base ──────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] [KAIROS] ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch { /* logging best-effort */ }
}

function read(rel) {
  const abs = path.join(ROOT, rel);
  try { return fs.readFileSync(abs, 'utf8'); } catch { return null; }
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

/** Recorre un directorio y devuelve rutas relativas a ROOT que cumplen el filtro. */
function walk(relDir, exts) {
  const out = [];
  const base = path.join(ROOT, relDir);
  if (!fs.existsSync(base)) return out;
  const stack = [base];
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'build') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { stack.push(full); continue; }
      if (!exts || exts.some(x => e.name.endsWith(x))) {
        out.push(path.relative(ROOT, full));
      }
    }
  }
  return out;
}

// ─── Modelo de dominio: lo que ES KRONOS ───────────────────────────────────────
// Mapa de las integraciones que el proyecto declara querer tener. Kairos usa esto
// como "verdad esperada" y la contrasta contra lo que realmente está cableado.

const INTEGRATIONS = [
  {
    id: 'mongodb',     name: 'MongoDB (base de datos)',
    dep: 'mongoose',   env: ['MONGODB_URI'], code: ['server/config/database.js'], critical: true,
  },
  {
    id: 'auth-jwt',    name: 'Autenticación JWT',
    dep: 'jsonwebtoken', env: ['JWT_SECRET'], code: ['server/routes/auth.js'], critical: true,
  },
  {
    id: 'stripe',      name: 'Pagos / Suscripciones (Stripe)',
    dep: 'stripe',     env: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
    code: ['server/routes/checkout.js', 'server/routes/subscription.js'], critical: true,
  },
  {
    id: 'cloudinary',  name: 'Almacenamiento multimedia (Cloudinary)',
    dep: 'cloudinary', env: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    code: ['server/routes/multimedia.js'], critical: true,
  },
  {
    id: 'openai',      name: 'IA generativa (OpenAI)',
    dep: 'openai',     env: ['OPENAI_API_KEY'], code: ['server/services/aiService.js'], critical: false,
  },
  {
    id: 'deepl',       name: 'Traducción (DeepL)',
    dep: null,         env: ['DEEPL_API_KEY'], code: ['server/routes/translation.js'], critical: false,
  },
  {
    id: 'web3',        name: 'Token KRO / Web3 (ethers + Infura)',
    dep: 'ethers',     env: ['INFURA_API_KEY', 'SEPOLIA_RPC_URL', 'KRONOS_TOKEN_ADDRESS'],
    code: ['server/services/tokenService.js'], critical: false,
  },
  {
    id: 'push',        name: 'Notificaciones push (Web Push / VAPID)',
    dep: 'web-push',   env: ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT'],
    code: ['server/services/pushService.js'], critical: false,
  },
  {
    id: 'email',       name: 'Email transaccional (Nodemailer)',
    dep: 'nodemailer', env: ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASSWORD'],
    code: ['server/services/emailService.js'], critical: false,
  },
  {
    id: 'oauth',       name: 'Login social (Google / Facebook OAuth)',
    dep: 'passport',   env: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    code: [], critical: false,
  },
  {
    id: 'socketio',    name: 'Comunicación en tiempo real (Socket.io)',
    dep: 'socket.io',  env: ['REACT_APP_SOCKET_URL'],
    code: ['server/server.js'], critical: true,
  },
];

// Valores que delatan un secreto SIN configurar (placeholder dejado en el ejemplo).
const PLACEHOLDER_RE = /^$|cambiame|tu_|tu-|xxxx|pk_test_$|sk-proj-tu|_aqui|direccion_del|example|changeme/i;

// ─── Auditoría: variables de entorno ────────────────────────────────────────────

function parseEnvKeys(content) {
  if (!content) return {};
  const map = {};
  for (const raw of content.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    map[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return map;
}

function parseRenderKeys(content) {
  if (!content) return [];
  // Captura "- key: NOMBRE" del render.yaml sin dependencias YAML externas.
  return [...content.matchAll(/-\s*key:\s*([A-Z0-9_]+)/g)].map(m => m[1]);
}

// Archivos dev-only (seeds, tests, scripts de validación) — sus envs no son
// requisitos de producción, así que no cuentan como "gaps".
const DEV_FILE_RE = /(__tests__|\.test\.|seedData|final-validation|test-dependencies|check-status|generate-)/;

function collectEnvUsage() {
  const server = new Set();
  const client = new Set();
  const re = /process\.env\.([A-Z0-9_]+)/g;
  for (const f of walk('server', ['.js'])) {
    if (DEV_FILE_RE.test(f)) continue;
    const c = read(f); if (!c) continue;
    for (const m of c.matchAll(re)) server.add(m[1]);
  }
  for (const f of walk('client/src', ['.js', '.jsx'])) {
    const c = read(f); if (!c) continue;
    for (const m of c.matchAll(re)) client.add(m[1]);
  }
  return { server: [...server], client: [...client] };
}

function auditEnv() {
  const findings = [];
  const envExample = parseEnvKeys(read('.env.example'));
  const renderKeys = parseRenderKeys(read('render.yaml'));
  const usage = collectEnvUsage();

  // Verificar si existe el archivo .env real para desarrollo local
  if (!exists('.env') && !exists('.env.local')) {
    findings.push({
      sev: 'warn', area: 'env',
      msg: 'No se detectó un archivo .env local. Kairos recomienda crear uno basado en .env.example para que las integraciones funcionen localmente.',
      fixable: false,
    });
  }

  const exampleKeys = new Set(Object.keys(envExample));
  const renderSet = new Set(renderKeys);

  // 1) Vars usadas en el servidor pero no documentadas en .env.example.
  for (const key of usage.server) {
    if (key === 'NODE_ENV' || key === 'PORT' || key === 'npm_package_version') continue;
    if (!exampleKeys.has(key)) {
      findings.push({
        sev: 'warn', area: 'env',
        msg: `El servidor usa process.env.${key} pero NO está en .env.example (riesgo: se olvida al desplegar).`,
        fixable: true, fixKind: 'env-doc', key,
      });
    }
    // Var de servidor (no REACT_APP_) que no está declarada en render.yaml.
    if (!key.startsWith('REACT_APP_') && !renderSet.has(key)) {
      findings.push({
        sev: 'warn', area: 'env',
        msg: `process.env.${key} no está declarada en render.yaml — Render no la inyectará en producción.`,
        fixable: false,
      });
    }
  }

  // 2) Secretos críticos con valor placeholder en .env.example (informativo).
  for (const [key, val] of Object.entries(envExample)) {
    const isSecret = /KEY|SECRET|TOKEN|URI|PASS|PASSWORD/i.test(key);
    if (isSecret && PLACEHOLDER_RE.test(val)) {
      findings.push({
        sev: 'info', area: 'env',
        msg: `${key} en .env.example es un placeholder — recuerda poner el valor real en Render/Vercel (no en Git).`,
        fixable: false,
      });
    }
  }

  // 3) Incoherencia conocida: nombres de env de email distintos entre archivos.
  const emailExample = Object.keys(envExample).filter(k => /^SMTP_/.test(k));
  const emailRender = renderKeys.filter(k => /^EMAIL_/.test(k));
  if (emailExample.length && emailRender.length) {
    findings.push({
      sev: 'error', area: 'env',
      msg: `Incoherencia de email: .env.example usa ${emailExample.join(', ')} pero render.yaml usa ${emailRender.join(', ')}. El código lee uno solo — unifica los nombres o el envío de correo fallará en producción.`,
      fixable: false,
    });
  }

  return findings;
}

// ─── Auditoría: cableado de rutas del servidor ─────────────────────────────────

function auditRoutes() {
  const findings = [];
  const serverJs = read('server/server.js');
  if (!serverJs) return findings;

  const routeFiles = walk('server/routes', ['.js']).map(f => path.basename(f, '.js'));
  for (const name of routeFiles) {
    const registered = new RegExp(`require\\(['"]\\./routes/${name}['"]\\)`).test(serverJs);
    if (!registered) {
      findings.push({
        sev: 'error', area: 'routes',
        msg: `La ruta server/routes/${name}.js existe pero NO está registrada en server.js (endpoint muerto, inaccesible desde la web).`,
        fixable: true, fixKind: 'register-route', route: name,
      });
    }
  }
  return findings;
}

// ─── Auditoría: páginas del cliente sin ruta ────────────────────────────────────

function auditClientPages() {
  const findings = [];
  if (!exists('client/src/App.jsx')) return findings;

  const SKIP = new Set(['KronosMockups']); // showcases internos
  // Una página está "conectada" si CUALQUIER otro archivo del cliente la importa
  // o referencia por nombre (cubre rutas anidadas tipo /admin/* y layouts).
  const allClient = walk('client/src', ['.js', '.jsx']);
  for (const f of walk('client/src/pages', ['.jsx'])) {
    const name = path.basename(f, '.jsx');
    if (SKIP.has(name)) continue;
    const referenced = allClient.some(other => {
      if (other === f) return false;
      const c = read(other);
      return c && new RegExp(`\\b${name}\\b`).test(c);
    });
    if (!referenced) {
      findings.push({
        sev: 'warn', area: 'client',
        msg: `La página ${f} existe pero ningún otro archivo del cliente la referencia — probablemente no tiene <Route> y el usuario no puede llegar a ella.`,
        fixable: false,
      });
    }
  }
  return findings;
}

// ─── Auditoría: integraciones completas vs a medias ────────────────────────────

function loadDeps() {
  const s = JSON.parse(read('server/package.json') || '{}');
  const c = JSON.parse(read('client/package.json') || '{}');
  return {
    server: { ...(s.dependencies || {}), ...(s.devDependencies || {}) },
    client: { ...(c.dependencies || {}), ...(c.devDependencies || {}) },
  };
}

function auditIntegrations() {
  const findings = [];
  const deps = loadDeps();
  const envExample = parseEnvKeys(read('.env.example'));
  const renderKeys = new Set(parseRenderKeys(read('render.yaml')));
  const declared = new Set([...Object.keys(envExample), ...renderKeys]);

  for (const intg of INTEGRATIONS) {
    const missing = [];
    if (intg.dep && !deps.server[intg.dep]) missing.push(`dependencia "${intg.dep}" no instalada`);
    for (const e of intg.env) if (!declared.has(e)) missing.push(`falta var ${e}`);
    for (const c of intg.code) if (!exists(c)) missing.push(`falta archivo ${c}`);

    if (missing.length) {
      const sev = intg.critical ? 'error' : 'warn';
      findings.push({
        sev, area: 'integration', intg: intg.id,
        msg: `${intg.name}: integración incompleta → ${missing.join('; ')}.`,
        fixable: false,
      });
    }
  }
  return findings;
}

// ─── Auditoría: listo para desplegar en la web ─────────────────────────────────

function auditDeploy() {
  const findings = [];

  if (!exists('render.yaml')) {
    findings.push({ sev: 'error', area: 'deploy', msg: 'Falta render.yaml — el backend no tiene definición de despliegue en Render.', fixable: false });
  } else {
    const render = read('render.yaml');
    const m = render.match(/healthCheckPath:\s*(\S+)/);
    if (m) {
      const serverJs = read('server/server.js') || '';
      if (!serverJs.includes(m[1])) {
        findings.push({ sev: 'warn', area: 'deploy', msg: `healthCheckPath "${m[1]}" del render.yaml no parece existir en server.js — Render marcará el servicio como caído.`, fixable: false });
      }
    }
  }

  if (!exists('vercel.json')) {
    findings.push({ sev: 'error', area: 'deploy', msg: 'Falta vercel.json — el frontend no tiene configuración de build/SPA en Vercel.', fixable: false });
  }

  const clientPkg = JSON.parse(read('client/package.json') || '{}');
  if (!clientPkg.scripts || !clientPkg.scripts.build) {
    findings.push({ sev: 'error', area: 'deploy', msg: 'El cliente no tiene script "build" — Vercel no podrá compilar el frontend.', fixable: false });
  }

  // El cliente necesita apuntar al backend de producción, no a localhost.
  const example = parseEnvKeys(read('.env.example'));
  if (example.REACT_APP_API_URL && /localhost/.test(example.REACT_APP_API_URL)) {
    findings.push({ sev: 'info', area: 'deploy', msg: 'REACT_APP_API_URL apunta a localhost en .env.example — en Vercel debe ser la URL de Render terminada en /api.', fixable: false });
  }

  // Validación de URL de Sockets
  if (example.REACT_APP_SOCKET_URL) {
    if (example.REACT_APP_SOCKET_URL.endsWith('/')) {
      findings.push({ 
        sev: 'warn', area: 'deploy', 
        msg: 'REACT_APP_SOCKET_URL termina en "/". Socket.io a veces presenta problemas de handshake si la URL base incluye la barra final.', 
        fixable: false 
      });
    }
  }
  return findings;
}

// ─── Directiva: secretos al descubierto (hardcoded) ────────────────────────────
// Busca claves/contraseñas escritas directo en el código en vez de en envs.

const SECRET_PATTERNS = [
  { re: /\bsk_(live|test)_[A-Za-z0-9]{10,}/, what: 'clave secreta de Stripe (sk_)' },
  { re: /\bwhsec_[A-Za-z0-9]{10,}/, what: 'secreto de webhook de Stripe (whsec_)' },
  { re: /\bGOCSPX-[A-Za-z0-9_-]{10,}/, what: 'client secret de Google OAuth' },
  { re: /\bAIza[0-9A-Za-z_-]{30,}/, what: 'API key de Google (AIza)' },
  { re: /\bAKIA[0-9A-Z]{16}\b/, what: 'access key de AWS (AKIA)' },
  { re: /mongodb(\+srv)?:\/\/[^\s'"`]+:[^\s'"`@]+@/, what: 'connection string de Mongo con usuario:contraseña' },
  { re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, what: 'llave privada' },
];

function auditSecrets() {
  const findings = [];
  const files = [...walk('server', ['.js']), ...walk('client/src', ['.js', '.jsx'])];
  for (const f of files) {
    if (DEV_FILE_RE.test(f)) continue;
    const c = read(f); if (!c) continue;
    for (const { re, what } of SECRET_PATTERNS) {
      if (re.test(c)) {
        findings.push({
          sev: 'error', area: 'security',
          msg: `${f}: parece tener un ${what} escrito directo en el código — muévelo a una variable de entorno (queda expuesto en Git).`,
          fixable: false,
        });
      }
    }
  }
  return findings;
}

// ─── Directiva: rutas sensibles sin candado de autenticación ────────────────────

const SENSITIVE_ROUTES = ['wallet', 'admin', 'refunds', 'twofactor', 'tips', 'subscription'];
const AUTH_TOKENS = /\b(protect|requireAdmin|adminAuth|web3Auth|authMiddleware|verifyToken|isAuthenticated)\b/;

function auditRouteGuards() {
  const findings = [];
  for (const name of SENSITIVE_ROUTES) {
    const rel = `server/routes/${name}.js`;
    const c = read(rel);
    if (!c) continue;
    const hasRoutes = /router\.(get|post|put|patch|delete)\s*\(/.test(c);
    if (hasRoutes && !AUTH_TOKENS.test(c)) {
      findings.push({
        sev: 'error', area: 'security',
        msg: `${rel}: ruta sensible SIN middleware de autenticación — cualquiera podría usarla sin iniciar sesión. Agrega "protect" (o el guard que corresponda).`,
        fixable: false,
      });
    }
  }
  return findings;
}

// ─── Directiva: pagos bien armados (Stripe) ────────────────────────────────────

function auditPayments() {
  const findings = [];
  const plans = read('server/config/subscriptionPlans.js');
  if (plans) {
    const declared = new Set([
      ...Object.keys(parseEnvKeys(read('.env.example'))),
      ...parseRenderKeys(read('render.yaml')),
    ]);
    for (const m of plans.matchAll(/priceEnv:\s*'([A-Z0-9_]+)'/g)) {
      if (!declared.has(m[1])) {
        findings.push({
          sev: 'error', area: 'payments',
          msg: `El plan de pago necesita ${m[1]} pero esa variable no está documentada en .env.example ni render.yaml — ese plan no se podrá cobrar.`,
          fixable: false,
        });
      }
    }
  }
  // El webhook debe verificar la firma de Stripe (constructEvent), si no, es falsificable.
  const usesStripe = walk('server', ['.js']).some(f => !DEV_FILE_RE.test(f) && /STRIPE_SECRET_KEY|require\(['"]stripe['"]\)/.test(read(f) || ''));
  const verifiesWebhook = walk('server', ['.js']).some(f => /constructEvent/.test(read(f) || ''));
  if (usesStripe && !verifiesWebhook) {
    findings.push({
      sev: 'error', area: 'payments',
      msg: 'Usas Stripe pero ningún archivo verifica la firma del webhook (stripe.webhooks.constructEvent) — cualquiera podría falsificar un "pago exitoso".',
      fixable: false,
    });
  }
  return findings;
}

// ─── Directiva: endpoints fantasma (cliente llama API que no existe) ────────────

function auditPhantomEndpoints() {
  const findings = [];
  const serverJs = read('server/server.js');
  if (!serverJs) return findings;

  // Segmentos de API realmente registrados en el servidor.
  const registered = new Set();
  for (const m of serverJs.matchAll(/app\.(?:use|get|post|put|patch|delete)\(\s*['"`]\/api\/([a-zA-Z0-9-]+)/g)) {
    registered.add(m[1]);
  }

  // Segmentos que el cliente invoca.
  const seen = new Map(); // segmento → primer archivo donde aparece
  for (const f of walk('client/src', ['.js', '.jsx'])) {
    const c = read(f); if (!c) continue;
    for (const m of c.matchAll(/['"`]\/api\/([a-zA-Z0-9-]+)/g)) {
      if (!seen.has(m[1])) seen.set(m[1], f);
    }
  }

  for (const [seg, file] of seen) {
    if (!registered.has(seg)) {
      findings.push({
        sev: 'warn', area: 'client',
        msg: `El cliente llama a /api/${seg} (en ${file}) pero el servidor no tiene esa ruta registrada — esa llamada va a fallar.`,
        fixable: false,
      });
    }
  }
  return findings;
}

// ════════════════════════════════════════════════════════════════════════════
//  MODO INGENIERO — revisiones de calidad de código (lo que cacha un dev senior)
// ════════════════════════════════════════════════════════════════════════════

// Archivos de producción (sin seeds/tests/scripts).
function prodFiles(scope) {
  const dirs = scope === 'server' ? ['server'] : scope === 'client' ? ['client/src'] : ['server', 'client/src'];
  const out = [];
  for (const d of dirs) for (const f of walk(d, ['.js', '.jsx'])) if (!DEV_FILE_RE.test(f)) out.push(f);
  return out;
}

const IMPORT_EXTS = ['', '.jsx', '.js', '.json', '.ts', '.tsx', '/index.jsx', '/index.js', '/index.ts'];

function auditEngineering() {
  const findings = [];
  const importRe = /(import[^"']*?from|require\()\s*["'](\.[^"']+)["']/g;
  for (const f of prodFiles()) {
    const raw = read(f); if (!raw) continue;
    const dir = path.dirname(path.join(ROOT, f));

    // Quitar comentarios para no confundir ejemplos de JSDoc con imports reales.
    const c = raw
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

    // Imports rotos → rompen el build (import) o truenan al ejecutarse (require).
    for (const m of c.matchAll(importRe)) {
      const target = path.resolve(dir, m[2]);
      if (IMPORT_EXTS.some(e => fs.existsSync(target + e))) continue;
      // Saltar requires opcionales protegidos con try { ... } catch.
      const before = c.slice(Math.max(0, m.index - 20), m.index);
      if (/try\s*\{[^}]*$/.test(before)) continue;
      const isStatic = m[1].startsWith('import');
      findings.push({
        sev: isStatic ? 'error' : 'warn', area: 'code',
        msg: isStatic
          ? `${f}: importa "${m[2]}" pero ese archivo no existe — rompe el build y la sección no abrirá.`
          : `${f}: hace require("${m[2]}") y ese archivo no existe — truena cuando se ejecute esa parte.`,
        fixable: false,
      });
    }

    // Funciones peligrosas: ejecución dinámica de código.
    if (/\beval\s*\(/.test(c)) {
      findings.push({ sev: 'error', area: 'security', msg: `${f}: usa eval() — permite ejecutar código arbitrario. Quítalo.`, fixable: false });
    }
    if (/(child_process|exec[A-Za-z]*)\s*\([^)]*(\$\{|\+\s*req\.)/.test(c)) {
      findings.push({ sev: 'error', area: 'security', msg: `${f}: ejecuta comandos del sistema con datos variables — riesgo de inyección de comandos.`, fixable: false });
    }

    // Logging de datos sensibles.
    if (/console\.(log|error|info|warn)\([^)]*\b(req\.body\.password|user\.password|\.privateKey|process\.env\.(JWT_SECRET|STRIPE_SECRET_KEY|EMAIL_PASSWORD))\b/.test(c)) {
      findings.push({ sev: 'warn', area: 'security', msg: `${f}: imprime datos sensibles (contraseña/secreto/clave) en consola — quítalo de los logs.`, fixable: false });
    }

    // Sintaxis de Vite (import.meta.env) en un proyecto Create React App:
    // siempre es undefined → la variable cae al fallback (localhost) en producción.
    if (f.startsWith('client/') && /import\.meta\.env/.test(c)) {
      findings.push({ sev: 'error', area: 'code', msg: `${f}: usa import.meta.env (sintaxis de Vite) pero el proyecto es Create React App — siempre será undefined y caerá al valor por defecto (localhost). Usa process.env.REACT_APP_*.`, fixable: false });
    }

    // URL de localhost incrustada en el cliente SIN ninguna variable de entorno
    // en el archivo (localhost puro = se va a producción tal cual).
    if (f.startsWith('client/') && /['"`]https?:\/\/localhost/.test(c) && !/process\.env/.test(c)) {
      findings.push({ sev: 'warn', area: 'code', msg: `${f}: usa una URL de localhost sin ninguna variable de entorno — en producción debe venir de process.env.REACT_APP_*.`, fixable: false });
    }
  }
  return findings;
}

// ════════════════════════════════════════════════════════════════════════════
//  MODO PENTESTER — Kairos ataca tu propio código buscando vulnerabilidades
// ════════════════════════════════════════════════════════════════════════════

function auditHardening() {
  const findings = [];
  const s = read('server/server.js') || '';

  // Middlewares defensivos que deben estar activos.
  const mids = [
    { re: /helmet\s*\(/, name: 'helmet', desc: 'cabeceras de seguridad HTTP' },
    { re: /mongoSanitize|mongo-sanitize/, name: 'express-mongo-sanitize', desc: 'previene inyección NoSQL' },
    { re: /\bxss\s*\(/, name: 'xss-clean', desc: 'previene XSS' },
    { re: /rateLimit|Limiter/, name: 'express-rate-limit', desc: 'frena fuerza bruta' },
  ];
  for (const m of mids) {
    if (!m.re.test(s)) findings.push({ sev: 'error', area: 'security', msg: `server.js no aplica ${m.name} (${m.desc}) — protección clave ausente.`, fixable: false });
  }

  // CORS abierto a cualquier origen.
  if (/origin:\s*['"`]\*['"`]/.test(s) || /['"]Access-Control-Allow-Origin['"]\s*[,:]\s*['"]\*/.test(s)) {
    findings.push({ sev: 'error', area: 'security', msg: `server.js permite CORS desde cualquier origen ('*') — restríngelo a tu dominio.`, fixable: false });
  }

  // bcrypt para contraseñas.
  const deps = loadDeps();
  if (!deps.server.bcrypt && !deps.server.bcryptjs) {
    findings.push({ sev: 'error', area: 'security', msg: `No hay bcrypt/bcryptjs instalado — verifica que las contraseñas NO se guarden en texto plano.`, fixable: false });
  }

  for (const f of prodFiles('server')) {
    const c = read(f); if (!c) continue;

    // JWT sin expiración → tokens eternos.
    let idx = c.indexOf('jwt.sign(');
    while (idx !== -1) {
      const seg = c.slice(idx, idx + 220);
      if (!/expiresIn|exp\b/.test(seg)) {
        findings.push({ sev: 'warn', area: 'security', msg: `${f}: jwt.sign sin "expiresIn" — los tokens nunca caducan (si se roban, valen para siempre).`, fixable: false });
        break;
      }
      idx = c.indexOf('jwt.sign(', idx + 1);
    }

    // Inyección NoSQL por $where.
    if (/\$where/.test(c)) {
      findings.push({ sev: 'warn', area: 'security', msg: `${f}: usa $where en una consulta — vector de inyección NoSQL, evítalo.`, fixable: false });
    }

    // Fuga de stack trace al cliente.
    if (/res\.[a-z]*\s*\(\s*[^)]*error\.stack/.test(c) || /\.json\(\s*err\s*\)/.test(c)) {
      findings.push({ sev: 'warn', area: 'security', msg: `${f}: parece devolver el error/stack crudo al cliente — filtra detalles internos. Manda un mensaje genérico.`, fixable: false });
    }
  }
  return findings;
}

// ─── Auto-fixes seguros ─────────────────────────────────────────────────────────

function applyFixes(findings, dryRun) {
  const applied = [];

  // 1) Registrar rutas huérfanas en server.js (antes del 404 handler / al final del bloque de rutas).
  const routeFixes = findings.filter(f => f.fixKind === 'register-route');
  if (routeFixes.length) {
    let serverJs = read('server/server.js');
    const anchor = "app.use('/api/health', require('./routes/health'));";
    if (serverJs && serverJs.includes(anchor)) {
      let insertion = '';
      for (const f of routeFixes) {
        const line = `app.use('/api/${f.route}', require('./routes/${f.route}')); // [auto] registrado por Kairos`;
        if (!serverJs.includes(`require('./routes/${f.route}')`)) insertion += '\n' + line;
        applied.push(`registrar ruta /api/${f.route}`);
      }
      if (insertion && !dryRun) {
        serverJs = serverJs.replace(anchor, anchor + insertion);
        fs.writeFileSync(path.join(ROOT, 'server/server.js'), serverJs);
      }
    }
  }

  // 2) Documentar en .env.example las vars que el código usa pero no están listadas.
  const envFixes = findings.filter(f => f.fixKind === 'env-doc');
  if (envFixes.length) {
    let envFile = read('.env.example') || '';
    let block = '\n# ============ Añadidas por Kairos (usadas en código, sin documentar) ============\n';
    let added = 0;
    for (const f of envFixes) {
      if (!new RegExp(`^${f.key}=`, 'm').test(envFile)) { block += `${f.key}=\n`; added++; applied.push(`documentar env ${f.key}`); }
    }
    if (added && !dryRun) fs.appendFileSync(path.join(ROOT, '.env.example'), block);
  }

  return applied;
}

// ─── Encolar tareas accionables en tasks.json ──────────────────────────────────

function pushTasks(findings) {
  let tasks = [];
  if (fs.existsSync(TASKS_FILE)) {
    try { tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')); } catch { tasks = []; }
  }
  const known = new Set(tasks.map(t => t.id));
  let added = 0;

  for (const f of findings) {
    if (f.sev === 'info') continue; // info no genera tarea
    const id = `kairos-${f.area}-${(f.key || f.route || f.intg || f.msg).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)}`;
    if (known.has(id)) continue;
    tasks.push({
      id,
      type: f.sev === 'error' ? 'security' : 'improvement',
      priority: f.sev === 'error' ? 1 : 4,
      title: f.msg.slice(0, 90),
      description: f.msg,
      files: f.route ? [`server/routes/${f.route}.js`, 'server/server.js'] : [],
      acceptance: ['Resuelto y verificado en producción'],
      status: f.fixable ? 'pending' : 'needs_human',
      source: 'kairos',
      detectedAt: new Date().toISOString(),
    });
    known.add(id);
    added++;
  }

  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  return added;
}

// ─── Informe en consola ─────────────────────────────────────────────────────────

function printReport(report) {
  const { findings } = report;
  const icon = { error: '🔴', warn: '🟡', info: '🔵' };
  const groups = { security: 'SEGURIDAD (modo pentester)', code: 'CÓDIGO (modo ingeniero)', deploy: 'DESPLIEGUE / WEB', payments: 'PAGOS (STRIPE)', env: 'VARIABLES DE ENTORNO', routes: 'CABLEADO DE RUTAS', integration: 'INTEGRACIONES', client: 'FRONTEND' };

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   KAIROS · ¿QUÉ LE FALTA A KRONOS PARA ESTAR EN LA WEB?  ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const counts = findings.reduce((a, f) => { a[f.sev] = (a[f.sev] || 0) + 1; return a; }, {});
  console.log(`\n  🔴 Bloqueantes: ${counts.error || 0}   🟡 Pendientes: ${counts.warn || 0}   🔵 Notas: ${counts.info || 0}\n`);

  for (const [area, title] of Object.entries(groups)) {
    const items = findings.filter(f => f.area === area);
    if (!items.length) continue;
    console.log(`\n── ${title} ${'─'.repeat(Math.max(0, 40 - title.length))}`);
    items.sort((a, b) => ({ error: 0, warn: 1, info: 2 }[a.sev] - { error: 0, warn: 1, info: 2 }[b.sev]));
    for (const f of items) {
      console.log(`  ${icon[f.sev]} ${f.msg}${f.fixable ? '  ⟵ auto-fix disponible' : ''}`);
    }
  }

  if (!findings.length) console.log('\n  ✅ Sin gaps detectados. KRONOS parece listo para producción.\n');
  console.log('');
}

// ════════════════════════════════════════════════════════════════════════════
//  MODO ESTUDIO — Kairos compara KRONOS contra las grandes redes y propone ideas
//  para destacar. El conocimiento de las otras redes está embebido (Kairos no
//  navega internet); lo que SÍ hace en vivo es leer tu código para saber qué
//  tienes ya, y a partir de eso decir qué te falta y qué te haría único.
// ════════════════════════════════════════════════════════════════════════════

// Funciones "de mesa" que toda red social grande tiene. (feature → archivo que la prueba)
const TABLE_STAKES = [
  { cap: 'Feed de publicaciones',        proof: 'server/routes/posts.js',          nets: 'todas' },
  { cap: 'Mensajería directa (DM)',      proof: 'server/routes/messages.js',       nets: 'todas' },
  { cap: 'Chats grupales',               proof: 'server/routes/groupChats.js',     nets: 'WhatsApp, Discord' },
  { cap: 'Stories 24h',                  proof: 'server/routes/ephemeralStories.js',nets: 'Instagram, Snapchat' },
  { cap: 'Video (subida/streaming)',     proof: 'server/routes/videos.js',         nets: 'TikTok, YouTube' },
  { cap: 'Comunidades / grupos',         proof: 'server/routes/communities.js',    nets: 'Reddit, Facebook' },
  { cap: 'Notificaciones en tiempo real',proof: 'server/routes/notifications.js',  nets: 'todas' },
  { cap: 'Búsqueda',                     proof: 'server/routes/search.js',         nets: 'todas' },
  { cap: 'Recomendaciones / descubrir',  proof: 'server/routes/recommendations.js',nets: 'TikTok, Instagram' },
  { cap: 'Reportar / bloquear',          proof: 'server/routes/reporting.js',      nets: 'todas' },
  { cap: 'Salas de audio en vivo',       proof: 'server/routes/audio.js',          nets: 'Clubhouse, X Spaces' },
  { cap: 'Eventos',                      proof: 'server/routes/events.js',         nets: 'Facebook, Meetup' },
];

// Lo que tienen otras redes que KRONOS podría querer y conviene revisar si falta.
const COMMON_ELSEWHERE = [
  { cap: 'Encuestas / polls en posts',          hint: 'X, Instagram',  proof: null },
  { cap: 'Reacciones múltiples (no solo like)',  hint: 'Facebook, LinkedIn', proof: null },
  { cap: 'Hashtags y temas en tendencia',        hint: 'X, Instagram',  proof: 'client/src/components/HashtagText.jsx' },
  { cap: 'Guardar / colecciones (bookmarks)',    hint: 'Instagram, Pinterest', proof: null },
  { cap: 'Duetos / remix de video',              hint: 'TikTok',        proof: null },
  { cap: 'Suscripción a creadores (paywall)',    hint: 'Patreon, OnlyFans', proof: 'server/routes/subscription.js' },
];

// Ideas diferenciadoras: cada una se apoya en algo que KRONOS YA tiene en su
// modelo de datos, así que son extensiones realistas, no fantasía.
const DIFFERENTIATORS = [
  {
    title: 'Historias interactivas "elige tu aventura"',
    basadoEn: ['server/models/StoryNode.js', 'server/models/StoryProgress.js'],
    idea: 'Stories ramificadas donde el espectador toca opciones y cambia el final. Ya tienes los nodos y el progreso modelados; falta el editor visual y el reproductor.',
    porQue: 'Ninguna red grande tiene narrativa ramificada nativa. Es contenido que engancha y se comparte solo.',
  },
  {
    title: 'SocialFi: gana KRO por buen contenido + apuesta para impulsar',
    basadoEn: ['server/models/RewardPool.js', 'server/models/Stake.js', 'server/models/KronosToken.js'],
    idea: 'Recompensar con tokens KRO las publicaciones de calidad y dejar "stakear" KRO para impulsar un post o a un creador. Ya tienes pool de recompensas, staking y el token.',
    porQue: 'Mezcla economía real con red social — el creador gana de verdad, no solo "likes". WeChat/X tantean esto; tú ya tienes la base cripto.',
  },
  {
    title: 'Marketplace social con escrow (compra-venta segura entre usuarios)',
    basadoEn: ['server/models/Listing.js', 'server/models/Refund.js', 'server/models/CashWallet.js'],
    idea: 'Vender entre usuarios donde el dinero queda retenido (escrow) hasta que el comprador confirma — con reembolsos integrados. Ya tienes listings, refunds y wallet.',
    porQue: 'Facebook Marketplace no protege el pago; aquí la confianza es la función estrella. Diferenciador fuerte.',
  },
  {
    title: 'Estudio de creación con IA dentro de la app',
    basadoEn: ['server/routes/ai.js', 'server/services/aiService.js', 'server/config/subscriptionPlans.js'],
    idea: 'Pestaña "Crear con IA": genera guiones, imágenes y videos sin salir de KRONOS, ligado a los planes que ya cobras (scripts/media).',
    porQue: 'Ninguna red junta creación con IA + monetización en un mismo flujo. Tú ya tienes el cobro por cuotas armado.',
  },
  {
    title: 'Capa social en Realidad Aumentada + avatares 3D',
    basadoEn: ['server/routes/ar.js', 'server/models/AvatarItem.js', 'server/models/UserAvatar.js'],
    idea: 'Filtros/objetos AR, probarte items del marketplace en AR, y "drops" AR por ubicación que sueltan KRO al encontrarlos (estilo Pokémon GO).',
    porQue: 'Snapchat tiene AR pero no economía; tú puedes unir AR + token + comercio.',
  },
  {
    title: 'Move-to-earn: gana KRO por moverte',
    basadoEn: ['server/models/HealthLog.js', 'server/models/RewardPool.js'],
    idea: 'Conectar actividad física (pasos/ejercicio) con recompensas en KRO y retos sociales entre amigos. Ya registras salud.',
    porQue: 'StepN demostró que mueve millones; ninguna red social mainstream lo integra. Encaja con tu wallet.',
  },
  {
    title: 'Propinas y regalos en vivo con KRO',
    basadoEn: ['server/models/Tip.js', 'server/routes/audio.js', 'server/routes/videos.js'],
    idea: 'Regalar KRO en tiempo real durante salas de audio o video en vivo (como los "bits" de Twitch, pero con valor real y retirable).',
    porQue: 'Monetización directa creador-fan sin intermediario caro. Ya tienes propinas y salas en vivo.',
  },
];

function runStudy(options = {}) {
  const present = [];
  const missingStakes = [];
  for (const t of TABLE_STAKES) {
    (exists(t.proof) ? present : missingStakes).push(t);
  }
  const missingCommon = COMMON_ELSEWHERE.filter(c => !c.proof || !exists(c.proof));

  const lines = [];
  const push = (s = '') => lines.push(s);

  push('# 🧠 KAIROS · Estudio comparativo de KRONOS vs las grandes redes');
  push(`_Generado: ${new Date().toISOString()}_`);
  push('');
  push('## 1. Qué tipo de producto es KRONOS');
  push('No es "otra red social": es una **super-app** (social + comercio + delivery + wallet cripto/fiat + IA + AR), más cerca del modelo de WeChat que de Instagram. Esa combinación ES tu ventaja: nadie en occidente la tiene junta.');
  push('');
  push(`## 2. Funciones base que ya tienes (${present.length}/${TABLE_STAKES.length})`);
  for (const t of present) push(`- ✅ ${t.cap}  _(como ${t.nets})_`);
  if (missingStakes.length) {
    push('');
    push('### Funciones base que conviene revisar:');
    for (const t of missingStakes) push(`- ⚠️ ${t.cap} — la tienen ${t.nets}. No encontré \`${t.proof}\`.`);
  }
  push('');
  push('## 3. Detalles que otras redes tienen y a ti quizá te falten');
  if (missingCommon.length) {
    for (const c of missingCommon) push(`- 💡 ${c.cap}  _(visto en ${c.hint})_`);
  } else {
    push('- ✅ Cubres incluso los extras comunes.');
  }
  push('');
  push('## 4. 🚀 Ideas para DESTACAR (apoyadas en lo que ya tienes)');
  push('Ordenadas por impacto. Cada una se construye sobre modelos que ya existen en tu código:');
  push('');
  DIFFERENTIATORS.forEach((d, i) => {
    push(`### ${i + 1}. ${d.title}`);
    push(`- **La idea:** ${d.idea}`);
    push(`- **Por qué resalta:** ${d.porQue}`);
    push(`- **Ya tienes la base en:** ${d.basadoEn.map(f => '`' + f + '`').join(', ')}`);
    push('');
  });
  push('## 5. Recomendación de Kairos');
  push('Tu mayor diferenciador NO es copiar funciones de otras redes — es **unir lo social con la economía KRO**. Prioriza: (1) SocialFi (ganar/impulsar con KRO), (2) Historias interactivas, (3) Marketplace con escrow. Son únicas y ya tienes los cimientos.');
  push('');

  const out = lines.join('\n');
  console.log('\n' + out + '\n');

  if (!options.reportOnly) {
    const file = path.join(__dirname, 'logs', 'kairos-study.md');
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, out);
      log(`Estudio guardado en ${path.relative(ROOT, file)}`);
      console.log(`  📄 Estudio guardado en agents/logs/kairos-study.md`);
    } catch { /* best-effort */ }
  }
  return { present, missingStakes, missingCommon, ideas: DIFFERENTIATORS };
}

// ─── Orquestación del agente ────────────────────────────────────────────────────

function audit() {
  log('=== KAIROS iniciando auditoría completa de KRONOS ===');

  // Validación de integridad de la estructura de la aplicación web
  if (!exists('server') || !exists('client')) {
    return [{
      sev: 'error', area: 'deploy', 
      msg: 'Kairos no detecta las carpetas /server o /client. Asegúrate de ejecutar el agente desde la raíz del proyecto KRONOS.',
      fixable: false 
    }];
  }

  const findings = [
    ...auditDeploy(),
    ...auditEnv(),
    ...auditRoutes(),
    ...auditIntegrations(),
    ...auditSecrets(),
    ...auditRouteGuards(),
    ...auditPayments(),
    ...auditPhantomEndpoints(),
    ...auditEngineering(),
    ...auditHardening(),
    ...auditClientPages(),
  ];
  log(`Auditoría completada: ${findings.length} hallazgos`);
  return { generatedAt: new Date().toISOString(), findings };
}

function run(options = {}) {
  const { reportOnly = false, fix = false, json = false } = options;
  const report = audit();

  if (json) { console.log(JSON.stringify(report, null, 2)); return report; }

  printReport(report);

  if (reportOnly) {
    log('Modo --report: no se escriben tareas ni fixes.');
    return report;
  }

  try {
    fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  } catch { /* best-effort */ }

  const added = pushTasks(report.findings);
  log(`${added} tareas nuevas encoladas en tasks.json para Builder Alpha / Pelos.`);
  console.log(`  📋 ${added} tareas nuevas añadidas a la cola (node agents/orchestrator.js --status para verlas)`);

  if (fix) {
    const applied = applyFixes(report.findings, false);
    if (applied.length) {
      log(`Auto-fixes aplicados: ${applied.join(', ')}`);
      console.log(`  🔧 Auto-fixes aplicados (${applied.length}): ${applied.join(', ')}`);
    } else {
      console.log('  🔧 No había auto-fixes seguros pendientes.');
    }
  } else {
    const fixable = report.findings.filter(f => f.fixable).length;
    if (fixable) console.log(`  💡 ${fixable} hallazgos tienen auto-fix. Corre: node agents/kairos.js --fix`);
  }

  log('=== KAIROS finalizado ===');
  return report;
}

// ─── CLI / módulo ───────────────────────────────────────────────────────────────

// Modo vigilancia: re-audita cada vez que guardas un archivo (como un dev senior
// mirándote el hombro). Ctrl+C para salir.
function runWatch() {
  console.log('👁️  KAIROS en modo vigilancia — revisa al guardar. Ctrl+C para salir.\n');
  run({ reportOnly: true });
  let timer = null;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.clear();
      console.log('🔄 Cambio detectado — re-revisando...\n');
      run({ reportOnly: true });
      console.log('\n👁️  Vigilando... (Ctrl+C para salir)');
    }, 600);
  };
  for (const d of ['server', 'client/src', 'agents']) {
    const base = path.join(ROOT, d);
    if (!fs.existsSync(base)) continue;
    try { fs.watch(base, { recursive: true }, trigger); }
    catch { /* algunos FS no soportan recursive */ }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--watch')) {
    runWatch();
  } else if (args.includes('--study')) {
    runStudy({ reportOnly: args.includes('--report') });
  } else {
    run({
      reportOnly: args.includes('--report'),
      fix: args.includes('--fix'),
      json: args.includes('--json'),
    });
  }
} else {
  module.exports = { run, audit, runStudy };
}
