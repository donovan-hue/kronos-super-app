/**
 * KRONOS TASK MASTER AGENT
 * Analyzes the project and generates a prioritized task queue.
 * Runs on demand or on schedule. Writes tasks to agents/tasks.json.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.resolve(__dirname, '..', 'server', 'agents');
const TASKS_FILE = path.join(AGENTS_DIR, 'tasks.json');
const LOG_FILE = path.join(AGENTS_DIR, 'logs', 'task-master.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] [TASK-MASTER] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ─── Task definitions ─────────────────────────────────────────────────────────

const TASK_CATALOG = [
  // ── UX / UI improvements ──────────────────────────────────────────────────
  {
    id: 'ui-loading-skeleton',
    type: 'feature',
    priority: 1,
    title: 'Agregar skeletons de carga en Feed, Wallet y Communities',
    description: 'Reemplazar el spinner genérico con componentes Skeleton que imiten el layout real de cada página, mejorando la percepción de velocidad.',
    files: [
      'client/src/pages/Feed.jsx',
      'client/src/pages/Wallet.jsx',
      'client/src/pages/Communities.jsx',
      'client/src/components/kronos/Skeleton.jsx',
    ],
    acceptance: [
      'Skeleton visible durante fetch inicial',
      'Skeleton respeta el grid de la página',
      'Desaparece suavemente con fade-in cuando llegan los datos',
    ],
  },
  {
    id: 'ui-dark-empty-states',
    type: 'feature',
    priority: 2,
    title: 'Empty states con ilustración en Feed, Chat y Wallet',
    description: 'Cuando no hay datos mostrar un estado vacío con icono SVG, mensaje y CTA en lugar de una pantalla en blanco.',
    files: [
      'client/src/components/kronos/EmptyState.jsx',
      'client/src/pages/Feed.jsx',
      'client/src/social/ConversationList.jsx',
      'client/src/pages/Wallet.jsx',
    ],
    acceptance: [
      'Componente EmptyState reutilizable con props icon, title, subtitle, ctaLabel, ctaHref',
      'Usado en al menos 3 páginas',
    ],
  },
  {
    id: 'ui-toast-system',
    type: 'improvement',
    priority: 3,
    title: 'Unificar sistema de notificaciones toast',
    description: 'Centralizar todos los toast/alert en un solo helper useToast() que use react-hot-toast ya instalado. Eliminar console.log de errores visibles al usuario.',
    files: [
      'client/src/hooks/useToast.js',
      'client/src/pages/Wallet.jsx',
      'client/src/pages/Communities.jsx',
      'client/src/pages/Live.jsx',
    ],
    acceptance: [
      'Hook useToast exportado desde hooks/',
      'No hay alert() nativo en el código',
      'Errores de API muestran mensaje al usuario vía toast',
    ],
  },

  // ── Performance ───────────────────────────────────────────────────────────
  {
    id: 'perf-virtual-list',
    type: 'improvement',
    priority: 4,
    title: 'Virtualizar lista del Feed para manejar 1000+ posts',
    description: 'Usar react-window o la API nativa de Intersection Observer para renderizar solo los posts visibles y reducir DOM nodes.',
    files: [
      'client/src/components/HybridFeed.jsx',
    ],
    acceptance: [
      'Feed con 200+ posts no causa jank',
      'Memory usage no crece linealmente con el scroll',
    ],
  },
  {
    id: 'perf-image-lazy',
    type: 'improvement',
    priority: 5,
    title: 'Lazy loading nativo en todas las imágenes',
    description: 'Agregar loading="lazy" y placeholder blur en todos los <img> del proyecto. Usar Cloudinary URL transformations para servir WebP y tamaños correctos.',
    files: [
      'client/src/components/kronos/KronosImage.jsx',
      'client/src/social/Feed.jsx',
      'client/src/pages/Communities.jsx',
    ],
    acceptance: [
      'Componente KronosImage centraliza lazy loading',
      'Imágenes usan formato WebP cuando el browser lo soporta',
      'LCP (Largest Contentful Paint) mejora medible en DevTools',
    ],
  },

  // ── Backend / API ─────────────────────────────────────────────────────────
  {
    id: 'api-rate-limit',
    type: 'security',
    priority: 1,
    title: 'Rate limiting por endpoint sensible',
    description: 'Aplicar express-rate-limit en /auth/login, /wallet/transfer y /wallet/deposit para prevenir fuerza bruta y abuso.',
    files: [
      'server/middleware/rateLimit.js',
      'server/routes/auth.js',
      'server/routes/wallet.js',
    ],
    acceptance: [
      'Login bloqueado tras 10 intentos en 15 min',
      'Transfer/deposit bloqueado tras 20 req/min',
      'Response 429 con Retry-After header',
    ],
  },
  {
    id: 'api-pagination-cursor',
    type: 'improvement',
    priority: 6,
    title: 'Migrar paginación de offset a cursor en Feed y Chat',
    description: 'La paginación por offset tiene problemas con contenido dinámico. Migrar a cursor-based (usando _id) para consistencia.',
    files: [
      'server/controllers/postController.js',
      'server/controllers/chatController.js',
      'client/src/components/HybridFeed.jsx',
      'client/src/social/Chat.jsx',
    ],
    acceptance: [
      'GET /api/feed acepta cursor=<lastId>',
      'No hay posts duplicados al paginar',
    ],
  },
  {
    id: 'api-search-debounce',
    type: 'improvement',
    priority: 7,
    title: 'Debounce en búsqueda universal del cliente',
    description: 'La búsqueda dispara una request por cada keystroke. Agregar debounce de 300ms y cancelación de requests anteriores con AbortController.',
    files: [
      'client/src/pages/Search.jsx',
    ],
    acceptance: [
      'Máximo 1 request por 300ms de inactividad',
      'Requests obsoletas canceladas',
    ],
  },

  // ── Nuevas features ────────────────────────────────────────────────────────
  {
    id: 'feat-notifications-center',
    type: 'feature',
    priority: 2,
    title: 'Centro de notificaciones en tiempo real',
    description: 'Panel de notificaciones (likes, comentarios, mensajes, transferencias) con badge de conteo no leídas en Navbar, usando Socket.io ya existente.',
    files: [
      'client/src/components/NotificationCenter.jsx',
      'client/src/components/Navbar.jsx',
      'server/models/Notification.js',
      'server/controllers/notificationController.js',
      'server/routes/notifications.js',
    ],
    acceptance: [
      'Badge con número en icono de campana',
      'Panel slide-in con lista de notificaciones',
      'Marcar como leída al hacer click',
      'Socket event: notification_new',
    ],
  },
  {
    id: 'feat-story-reactions',
    type: 'feature',
    priority: 8,
    title: 'Reacciones rápidas en Stories (emojis)',
    description: 'Al ver una story, el usuario puede enviar una reacción emoji que llega como mensaje directo al autor.',
    files: [
      'client/src/components/stories/StoriesBar.jsx',
      'server/controllers/ephemeralStoryController.js',
    ],
    acceptance: [
      '6 emojis de reacción rápida',
      'Reacción se envía como DM automático',
      'Animación de emoji flotante al reaccionar',
    ],
  },
  {
    id: 'feat-wallet-qr',
    type: 'feature',
    priority: 3,
    title: 'QR de pago en Wallet',
    description: 'Generar un código QR único por usuario para recibir pagos/transferencias sin necesidad de buscar por username.',
    files: [
      'client/src/pages/Wallet.jsx',
      'client/src/components/kronos/QRCode.jsx',
    ],
    acceptance: [
      'QR visible en tab "wallet"',
      'QR contiene deeplink kronos://pay/<userId>',
      'Botón de descargar QR como imagen',
    ],
  },
  {
    id: 'feat-community-roles',
    type: 'feature',
    priority: 9,
    title: 'Sistema de roles en Comunidades (admin, mod, member)',
    description: 'Expandir el modelo de Community para soportar roles granulares: admin puede nombrar mods, mods pueden borrar posts.',
    files: [
      'server/models/Community.js',
      'server/controllers/communityController.js',
      'client/src/pages/CommunityDetail.jsx',
    ],
    acceptance: [
      'Schema Community tiene campo members: [{user, role}]',
      'Solo admins pueden asignar roles',
      'Badge de rol visible en lista de miembros',
    ],
  },

  // ── Tests ─────────────────────────────────────────────────────────────────
  {
    id: 'test-api-smoke',
    type: 'test',
    priority: 5,
    title: 'Smoke tests para endpoints críticos (wallet, auth, communities)',
    description: 'Tests con Jest + supertest que verifiquen que los endpoints críticos responden 200/201 con datos válidos y 401 sin token.',
    files: ['server/tests/smoke.test.js'],
    acceptance: [
      'npm test en /server pasa sin errores',
      'Cubre: POST /auth/login, GET /wallet, POST /wallet/transfer, GET /communities',
    ],
  },

  // ══════════════════════════════════════════════════════
  // WAVE 2 — Advanced features
  // ══════════════════════════════════════════════════════

  // ── UX ────────────────────────────────────────────────
  {
    id: 'ui-skeleton-wallet',
    type: 'improvement',
    priority: 1,
    title: 'Aplicar SkeletonWalletCard en Wallet mientras carga',
    description: 'Usar el componente SkeletonWalletCard ya creado para reemplazar el spinner de carga en la página Wallet.',
    files: ['client/src/pages/Wallet.jsx'],
    acceptance: ['Skeleton visible en lugar de spinner al cargar la wallet'],
  },
  {
    id: 'ui-skeleton-communities',
    type: 'improvement',
    priority: 2,
    title: 'Aplicar SkeletonList en Communities y Feed mientras cargan',
    description: 'Usar SkeletonList ya creado en Communities.jsx y en el spinner inicial del HybridFeed.',
    files: ['client/src/pages/Communities.jsx', 'client/src/components/HybridFeed.jsx'],
    acceptance: ['Skeletons visibles en ambas páginas durante carga inicial'],
  },
  {
    id: 'ui-notif-in-navbar',
    type: 'feature',
    priority: 1,
    title: 'Integrar NotificationCenter en Navbar',
    description: 'Reemplazar el ícono de campana estático del Navbar con el componente NotificationCenter ya creado.',
    files: ['client/src/components/Navbar.jsx'],
    acceptance: ['Campana en Navbar muestra badge de no leídas y abre panel al click'],
  },
  {
    id: 'ui-post-image-upload',
    type: 'feature',
    priority: 3,
    title: 'Subir imagen al crear post en el Feed',
    description: 'Agregar botón de adjuntar imagen al composer del HybridFeed, con preview y upload a Cloudinary.',
    files: ['client/src/components/HybridFeed.jsx'],
    acceptance: [
      'Botón 📷 en el composer abre file picker',
      'Preview de la imagen antes de publicar',
      'Imagen incluida en el post al publicar',
    ],
  },

  // ── Performance / Backend ──────────────────────────────
  {
    id: 'api-compress-responses',
    type: 'improvement',
    priority: 2,
    title: 'Compresión gzip/brotli en respuestas del servidor',
    description: 'Agregar el middleware compression de Express para reducir el tamaño de las respuestas JSON y HTML en producción.',
    files: ['server/server.js'],
    acceptance: [
      'npm install compression instalado en /server',
      'Respuestas con Content-Encoding: gzip para clientes que lo soporten',
    ],
  },
  {
    id: 'api-morgan-logging',
    type: 'improvement',
    priority: 4,
    title: 'Request logging con Morgan en el servidor',
    description: 'Agregar Morgan en modo "dev" para desarrollo y "combined" para producción. Redirigir logs a archivo en prod.',
    files: ['server/server.js'],
    acceptance: [
      'npm install morgan instalado',
      'Logs de requests visibles en consola en desarrollo',
    ],
  },

  // ── Nuevas features ────────────────────────────────────
  {
    id: 'feat-follow-suggestions',
    type: 'feature',
    priority: 2,
    title: 'Panel "A quién seguir" en el Feed',
    description: 'Sidebar o card horizontal con sugerencias de usuarios a seguir basadas en comunidades en común.',
    files: [
      'client/src/components/FollowSuggestions.jsx',
      'server/controllers/userController.js',
      'server/routes/users.js',
    ],
    acceptance: [
      'GET /api/users/suggestions devuelve hasta 5 usuarios',
      'Card con avatar, nombre y botón Seguir',
      'Se actualiza al seguir a alguien',
    ],
  },
  {
    id: 'feat-trending-hashtags',
    type: 'feature',
    priority: 5,
    title: 'Hashtags clicables en posts con trending sidebar',
    description: 'Detectar #hashtags en el contenido de posts, convertirlos en links y mostrar un panel de trending en el Feed.',
    files: [
      'client/src/components/HashtagText.jsx',
      'client/src/components/HybridFeed.jsx',
    ],
    acceptance: [
      'Componente HashtagText parsea #word y los convierte en spans clicables',
      'Click en hashtag filtra el feed por ese tag',
    ],
  },
  {
    id: 'feat-token-daily-reward',
    type: 'feature',
    priority: 3,
    title: 'Sistema de Daily Rewards en Tokens (check-in diario)',
    description: 'Permitir al usuario reclamar tokens una vez por día. Muestra racha de días consecutivos y recompensa escalada.',
    files: [
      'client/src/pages/Wallet.jsx',
      'server/controllers/walletController.js',
      'server/routes/wallet.js',
    ],
    acceptance: [
      'GET /api/wallet/daily-reward — devuelve { claimed, streakDays, reward }',
      'POST /api/wallet/daily-reward — reclama la recompensa del día',
      'UI en tab "kro" muestra estado del daily reward y racha',
    ],
  },
  {
    id: 'feat-search-history',
    type: 'feature',
    priority: 6,
    title: 'Historial de búsquedas recientes (localStorage)',
    description: 'Guardar las últimas 8 búsquedas en localStorage y mostrarlas como chips en la barra de búsqueda cuando está vacía.',
    files: ['client/src/pages/Search.jsx'],
    acceptance: [
      'Chips de búsquedas recientes visibles al enfocar la barra vacía',
      'Click en chip ejecuta la búsqueda',
      'Botón para limpiar historial',
    ],
  },
  {
    id: 'feat-post-bookmarks',
    type: 'feature',
    priority: 7,
    title: 'Guardar posts (bookmarks) con vista en perfil',
    description: 'Agregar botón 🔖 en cada post del Feed. Posts guardados accesibles en /profile/:id tab "guardados".',
    files: [
      'client/src/components/HybridFeed.jsx',
      'server/models/User.js',
      'server/controllers/postController.js',
      'server/routes/posts.js',
    ],
    acceptance: [
      'POST /api/posts/:id/bookmark — toggle guardado',
      'GET /api/posts/bookmarked — lista de posts guardados',
      'Ícono 🔖 lleno si el post está guardado',
    ],
  },

  // ── Seguridad ──────────────────────────────────────────
  {
    id: 'sec-input-sanitize',
    type: 'security',
    priority: 1,
    title: 'Sanitizar inputs con express-mongo-sanitize',
    description: 'Prevenir inyecciones NoSQL agregando express-mongo-sanitize antes de los routers en server.js.',
    files: ['server/server.js'],
    acceptance: [
      'npm install express-mongo-sanitize instalado',
      'app.use(mongoSanitize()) registrado antes de las rutas',
      'Payload con $where en body es bloqueado',
    ],
  },
  {
    id: 'sec-xss-clean',
    type: 'security',
    priority: 2,
    title: 'Protección XSS con xss-clean',
    description: 'Sanitizar HTML en todos los inputs del usuario antes de guardar en la DB usando el middleware xss-clean.',
    files: ['server/server.js'],
    acceptance: [
      'npm install xss-clean instalado',
      'app.use(xss()) registrado en server.js',
    ],
  },

  // ── Tests Wave 2 ───────────────────────────────────────
  {
    id: 'test-wallet-unit',
    type: 'test',
    priority: 4,
    title: 'Unit tests del walletController (transfer, deposit, getWallet)',
    description: 'Tests unitarios con Jest que mockean MongoDB y verifican la lógica de negocio del wallet.',
    files: ['server/tests/wallet.test.js'],
    acceptance: [
      'Transfer entre usuarios actualiza ambos balances',
      'Deposit incrementa balance',
      'Transfer con balance insuficiente retorna 400',
    ],
  },
];

// ─── Core logic ───────────────────────────────────────────────────────────────

function loadExistingTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function detectProjectGaps() {
  const gaps = [];

  // Check if rate limiting middleware exists
  const rateLimitPath = path.join(ROOT, 'server/middleware/rateLimit.js');
  if (!fs.existsSync(rateLimitPath)) {
    gaps.push('api-rate-limit');
  }

  // Check if notifications model exists
  const notifModel = path.join(ROOT, 'server/models/Notification.js');
  if (!fs.existsSync(notifModel)) {
    gaps.push('feat-notifications-center');
  }

  // Check if Skeleton component exists
  const skeletonComp = path.join(ROOT, 'client/src/components/kronos/Skeleton.jsx');
  if (!fs.existsSync(skeletonComp)) {
    gaps.push('ui-loading-skeleton');
  }

  // Check if useToast hook exists
  const toastHook = path.join(ROOT, 'client/src/hooks/useToast.js');
  if (!fs.existsSync(toastHook)) {
    gaps.push('ui-toast-system');
  }

  // Check if smoke tests exist
  const smokeTest = path.join(ROOT, 'server/tests/smoke.test.js');
  if (!fs.existsSync(smokeTest)) {
    gaps.push('test-api-smoke');
  }

  // Wave 2 gaps
  const notifCenter = path.join(ROOT, 'client/src/components/NotificationCenter.jsx');
  const navbarAbs = path.join(ROOT, 'client/src/components/Navbar.jsx');
  if (fs.existsSync(notifCenter) && fs.existsSync(navbarAbs)) {
    const navContent = fs.readFileSync(navbarAbs, 'utf8');
    if (!navContent.includes('NotificationCenter')) gaps.push('ui-notif-in-navbar');
  }

  const hashtagComp = path.join(ROOT, 'client/src/components/HashtagText.jsx');
  if (!fs.existsSync(hashtagComp)) gaps.push('feat-trending-hashtags');

  const mongoSanitize = path.join(ROOT, 'server/server.js');
  if (fs.existsSync(mongoSanitize)) {
    const serverContent = fs.readFileSync(mongoSanitize, 'utf8');
    if (!serverContent.includes('mongo-sanitize') && !serverContent.includes('mongoSanitize')) gaps.push('sec-input-sanitize');
    if (!serverContent.includes('xss') && !serverContent.includes('xss-clean')) gaps.push('sec-xss-clean');
    if (!serverContent.includes('compression')) gaps.push('api-compress-responses');
  }

  return gaps;
}

function generateTaskQueue() {
  log('Analizando proyecto...');

  const existing = loadExistingTasks();
  const completedIds = existing.filter(t => t.status === 'done').map(t => t.id);
  const inProgressIds = existing.filter(t => t.status === 'in_progress').map(t => t.id);

  const detectedGaps = detectProjectGaps();
  log(`Gaps detectados: ${detectedGaps.join(', ') || 'ninguno'}`);

  // Start fresh queue with detected gaps first, then full catalog
  const priorityIds = new Set([...detectedGaps]);
  const queue = [];

  for (const task of TASK_CATALOG) {
    if (completedIds.includes(task.id)) continue;
    if (inProgressIds.includes(task.id)) {
      queue.push({ ...task, status: 'in_progress', detectedAt: new Date().toISOString() });
      continue;
    }

    const boostedPriority = priorityIds.has(task.id) ? task.priority - 0.5 : task.priority;
    queue.push({
      ...task,
      status: 'pending',
      detectedAt: new Date().toISOString(),
      effectivePriority: boostedPriority,
    });
  }

  // Sort: in_progress first, then by effectivePriority asc, then security > feature > improvement > test
  const typeOrder = { security: 0, feature: 1, improvement: 2, test: 3 };
  queue.sort((a, b) => {
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
    const pa = a.effectivePriority ?? a.priority;
    const pb = b.effectivePriority ?? b.priority;
    if (pa !== pb) return pa - pb;
    return (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
  });

  log(`Cola generada con ${queue.length} tareas pendientes`);
  return queue;
}

function saveTasks(tasks) {
  fs.mkdirSync(path.dirname(TASKS_FILE), { recursive: true });
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  log(`tasks.json actualizado con ${tasks.length} tareas`);
}

function run() {
  log('=== TASK MASTER iniciando ===');
  const tasks = generateTaskQueue();
  saveTasks(tasks);

  const byType = tasks.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  log('Resumen:');
  for (const [type, count] of Object.entries(byType)) {
    log(`  ${type}: ${count}`);
  }
  log('=== TASK MASTER finalizado ===');
  return tasks;
}

// Exportar para uso como módulo o correr directamente
if (require.main === module) {
  run();
} else {
  module.exports = { run, generateTaskQueue, TASK_CATALOG };
}
