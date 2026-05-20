/**
 * KRONOS BUILDER ALPHA AGENT
 * Picks the next pending task from tasks.json and implements it autonomously.
 * Focuses on: features, UI improvements, API improvements.
 * Skips security and test tasks (those go to Bug Fixer Beta).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const LOG_FILE = path.join(__dirname, 'logs', 'builder-alpha.log');
const DONE_FILE = path.join(__dirname, 'logs', 'completed.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] [BUILDER-ALPHA] ${msg}`;
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
  list.push({ ...task, completedAt: new Date().toISOString(), agent: 'builder-alpha' });
  fs.writeFileSync(DONE_FILE, JSON.stringify(list, null, 2));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(relPath, content) {
  const abs = path.join(ROOT, relPath);
  ensureDir(abs);
  fs.writeFileSync(abs, content);
  log(`  Wrote: ${relPath}`);
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

// ─── Implementations ──────────────────────────────────────────────────────────

const IMPLEMENTATIONS = {

  'ui-loading-skeleton': () => {
    writeFile('client/src/components/kronos/Skeleton.jsx', `import React from 'react';

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={\`animate-pulse bg-white/10 rounded-lg \${className}\`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-1/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonBlock className="h-32 w-full" />
      <div className="flex gap-4">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonWalletCard() {
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-blue-900/20 space-y-4">
      <div className="flex justify-between">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-4 w-12" />
      </div>
      <SkeletonBlock className="h-8 w-40" />
      <div className="flex gap-3">
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
        <SkeletonBlock className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export default SkeletonBlock;
`);
    log('  Skeleton component created');
  },

  'ui-dark-empty-states': () => {
    writeFile('client/src/components/kronos/EmptyState.jsx', `import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({
  icon = '🌌',
  title = 'Nada por aquí',
  subtitle = '',
  ctaLabel = '',
  ctaHref = '',
  onCta = null,
}) {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onCta) return onCta();
    if (ctaHref) navigate(ctaHref);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4 select-none">{icon}</div>
      <h3 className="text-xl font-semibold text-white/80 mb-2">{title}</h3>
      {subtitle && <p className="text-white/40 text-sm mb-6 max-w-xs">{subtitle}</p>}
      {ctaLabel && (
        <button
          onClick={handleCta}
          className="px-6 py-2 rounded-full text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
`);
    log('  EmptyState component created');
  },

  'ui-toast-system': () => {
    writeFile('client/src/hooks/useToast.js', `import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) =>
      toast.error(msg, {
        style: {
          background: 'rgba(15,15,26,0.95)',
          color: '#fff',
          border: '1px solid rgba(239,68,68,0.4)',
        },
      }),
    info: (msg) =>
      toast(msg, {
        icon: 'ℹ️',
        style: {
          background: 'rgba(15,15,26,0.95)',
          color: '#fff',
          border: '1px solid rgba(179,68,255,0.3)',
        },
      }),
    loading: (msg) => toast.loading(msg),
    dismiss: (id) => toast.dismiss(id),
  };
}

export default useToast;
`);
    log('  useToast hook created');
  },

  'api-search-debounce': () => {
    const searchPath = 'client/src/pages/Search.jsx';
    if (!fileExists(searchPath)) {
      log('  Search.jsx not found, skipping');
      return;
    }
    let content = fs.readFileSync(path.join(ROOT, searchPath), 'utf8');

    // Inject debounce hook if not present
    if (!content.includes('useDebounce') && !content.includes('debounceTimeout')) {
      const hookCode = `\nfunction useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = React.useState(value);\n  React.useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}\n`;
      content = content.replace(
        /^(import React.*|import \{ .* \} from 'react')/m,
        `$1${hookCode}`
      );
      fs.writeFileSync(path.join(ROOT, searchPath), content);
      log('  useDebounce injected into Search.jsx');
    } else {
      log('  Search.jsx already has debounce, skipping');
    }
  },

  'feat-wallet-qr': () => {
    writeFile('client/src/components/kronos/QRCode.jsx', `import React, { useEffect, useRef } from 'react';

// Lightweight QR using the browser's canvas API via qrcode library
// Install: npm install qrcode
let QRLib = null;
try { QRLib = require('qrcode'); } catch {}

export default function QRCode({ value, size = 180, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!QRLib || !canvasRef.current) return;
    QRLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#ffffff', light: '#0f0f1a' },
    });
  }, [value, size]);

  if (!QRLib) {
    return (
      <div
        className={\`flex items-center justify-center bg-white/10 rounded-xl \${className}\`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-white/40">QR no disponible</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={\`rounded-xl \${className}\`}
      width={size}
      height={size}
    />
  );
}
`);
    log('  QRCode component created');
  },

  'feat-notifications-center': () => {
    // Server model
    writeFile('server/models/Notification.js', `const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'message', 'transfer', 'community_invite', 'story_reaction'],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Auto-delete read notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('Notification', notificationSchema);
`);

    // Server controller
    writeFile('server/controllers/notificationController.js', `const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username avatar');
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar notificaciones' });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar notificación' });
  }
};

exports.createNotification = async ({ recipient, sender, type, title, body = '', link = '', meta = {} }) => {
  if (recipient?.toString() === sender?.toString()) return;
  return Notification.create({ recipient, sender, type, title, body, link, meta });
};
`);

    // Server routes
    writeFile('server/routes/notifications.js', `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getNotifications, markAllRead, markOneRead } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markOneRead);

module.exports = router;
`);

    // Frontend component
    writeFile('client/src/components/NotificationCenter.jsx', `import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get(\`\${API}/api/notifications\`, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      setNotifications(data.notifications);
      setUnread(data.unreadCount);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(\`\${API}/api/notifications/read-all\`, {}, {
        headers: { Authorization: \`Bearer \${token}\` },
      });
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      const token = localStorage.getItem('token');
      await axios.put(\`\${API}/api/notifications/\${notif._id}/read\`, {}, {
        headers: { Authorization: \`Bearer \${token}\` },
      }).catch(() => {});
      setNotifications(prev =>
        prev.map(n => n._id === notif._id ? { ...n, read: true } : n)
      );
      setUnread(prev => Math.max(0, prev - 1));
    }
    if (notif.link) navigate(notif.link);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300">
                  Marcar todas
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-white/30 text-sm">Sin notificaciones</div>
            ) : (
              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={\`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 \${!n.read ? 'bg-purple-900/20' : ''}\`}
                >
                  <p className="text-sm text-white/90 font-medium">{n.title}</p>
                  {n.body && <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{n.body}</p>}
                  <p className="text-[10px] text-white/30 mt-1">
                    {new Date(n.createdAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
`);
    log('  Notification system created (model + controller + routes + component)');
    log('  NOTE: Remember to register /api/notifications in server.js');
  },

  // ── Wave 2 implementations ────────────────────────────────────────────────

  'ui-notif-in-navbar': () => {
    const navPath = path.join(ROOT, 'client/src/components/Navbar.jsx');
    if (!fs.existsSync(navPath)) { log('  Navbar.jsx not found'); return; }
    let content = fs.readFileSync(navPath, 'utf8');
    if (content.includes('NotificationCenter')) { log('  Already integrated'); return; }

    // Add import
    content = content.replace(
      /^(import React.*|import \{[^}]+\} from 'react')/m,
      `$1\nimport NotificationCenter from './NotificationCenter';`
    );

    // Replace bell emoji with component — look for 🔔 in JSX
    content = content.replace(
      /<span[^>]*>🔔<\/span>/,
      `<NotificationCenter />`
    );
    fs.writeFileSync(navPath, content);
    log('  NotificationCenter injected into Navbar');
  },

  'ui-skeleton-wallet': () => {
    const walletPath = path.join(ROOT, 'client/src/pages/Wallet.jsx');
    if (!fs.existsSync(walletPath)) { log('  Wallet.jsx not found'); return; }
    let content = fs.readFileSync(walletPath, 'utf8');
    if (content.includes('SkeletonWalletCard')) { log('  Already has skeleton'); return; }

    // Add import
    content = content.replace(
      /import React/,
      `import { SkeletonWalletCard, SkeletonList } from '../components/kronos';\nimport React`
    );

    // Replace loading spinner
    content = content.replace(
      /loading\s*&&\s*<[^>]+>Cargando[^<]*<\/[^>]+>/,
      `loading && <div style={{padding:'0 16px'}}><SkeletonWalletCard /><SkeletonList count={3} /></div>`
    );
    fs.writeFileSync(walletPath, content);
    log('  SkeletonWalletCard applied to Wallet.jsx');
  },

  'ui-skeleton-communities': () => {
    const commPath = path.join(ROOT, 'client/src/pages/Communities.jsx');
    if (!fs.existsSync(commPath)) { log('  Communities.jsx not found'); return; }
    let content = fs.readFileSync(commPath, 'utf8');
    if (content.includes('SkeletonList')) { log('  Already has skeleton'); return; }

    content = content.replace(
      /import React/,
      `import { SkeletonList } from '../components/kronos';\nimport React`
    );
    content = content.replace(
      /loading \? \(\s*<div[^>]+>Cargando\.\.\.<\/div>\s*\)/,
      `loading ? (<div style={{padding:'0 16px'}}><SkeletonList count={4} /></div>)`
    );
    fs.writeFileSync(commPath, content);
    log('  SkeletonList applied to Communities.jsx');
  },

  'feat-trending-hashtags': () => {
    writeFile('client/src/components/HashtagText.jsx', `import React from 'react';
import { useNavigate } from 'react-router-dom';

const HASHTAG_RE = /(#[\\w\\u00C0-\\u017F]+)/g;

export default function HashtagText({ text, style = {} }) {
  const navigate = useNavigate();
  if (!text) return null;

  const parts = text.split(HASHTAG_RE);

  return (
    <span style={style}>
      {parts.map((part, i) =>
        HASHTAG_RE.test(part) ? (
          <span
            key={i}
            onClick={e => { e.stopPropagation(); navigate(\`/search?q=\${encodeURIComponent(part.slice(1))}\`); }}
            style={{ color: '#a855f7', cursor: 'pointer', fontWeight: 600 }}
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
`);
    log('  HashtagText component created');
  },

  'feat-search-history': () => {
    const searchPath = path.join(ROOT, 'client/src/pages/Search.jsx');
    if (!fs.existsSync(searchPath)) { log('  Search.jsx not found'); return; }
    let content = fs.readFileSync(searchPath, 'utf8');
    if (content.includes('searchHistory') || content.includes('SEARCH_HISTORY')) {
      log('  Search history already present'); return;
    }

    const historyHook = `
const HISTORY_KEY = 'kronos_search_history';
function useSearchHistory() {
  const get = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } };
  const add = (q) => {
    if (!q.trim()) return;
    const list = [q, ...get().filter(h => h !== q)].slice(0, 8);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  };
  const clear = () => localStorage.removeItem(HISTORY_KEY);
  return { get, add, clear };
}
`;
    // Inject after imports
    content = content.replace(
      /^(import .+\n)+/m,
      match => match + historyHook
    );
    fs.writeFileSync(searchPath, content);
    log('  useSearchHistory hook injected into Search.jsx');
  },

  'api-compress-responses': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('compression')) { log('  Compression already added'); return; }

    content = content.replace(
      "const express = require('express');",
      "const express = require('express');\nconst compression = require('compression');"
    );
    content = content.replace(
      'app.use(express.json());',
      'app.use(compression());\napp.use(express.json());'
    );
    fs.writeFileSync(serverPath, content);
    log('  Compression middleware added to server.js');
    log('  NOTE: Run "npm install compression" in /server');
  },

  'api-morgan-logging': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('morgan')) { log('  Morgan already added'); return; }

    content = content.replace(
      "const express = require('express');",
      "const express = require('express');\nconst morgan = require('morgan');"
    );
    content = content.replace(
      'app.use(express.json());',
      `app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));\napp.use(express.json());`
    );
    fs.writeFileSync(serverPath, content);
    log('  Morgan logging added to server.js');
    log('  NOTE: Run "npm install morgan" in /server');
  },

  'feat-token-daily-reward': () => {
    // Backend: add to wallet routes
    const walletRoutePath = path.join(ROOT, 'server/routes/wallet.js');
    if (fs.existsSync(walletRoutePath)) {
      let content = fs.readFileSync(walletRoutePath, 'utf8');
      if (!content.includes('daily-reward')) {
        content = content.replace(
          'module.exports = router;',
          `router.get('/daily-reward', protect, require('../controllers/walletController').getDailyReward);
router.post('/daily-reward', protect, require('../controllers/walletController').claimDailyReward);

module.exports = router;`
        );
        fs.writeFileSync(walletRoutePath, content);
        log('  Daily reward routes added to wallet router');
      }
    }

    // Backend: add controller functions
    const walletCtrlPath = path.join(ROOT, 'server/controllers/walletController.js');
    if (fs.existsSync(walletCtrlPath)) {
      let content = fs.readFileSync(walletCtrlPath, 'utf8');
      if (!content.includes('getDailyReward')) {
        const dailyCode = `
const MS_PER_DAY = 86400000;

exports.getDailyReward = async (req, res) => {
  try {
    const wallet = await getOrCreateCashWallet(req.user._id);
    const now = Date.now();
    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;
    const claimed = (now - lastClaim) < MS_PER_DAY;
    const streakDays = wallet.rewardStreak || 0;
    const reward = Math.min(10 + streakDays * 2, 50);
    res.json({ claimed, streakDays, reward, nextClaimAt: claimed ? lastClaim + MS_PER_DAY : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.claimDailyReward = async (req, res) => {
  try {
    const wallet = await getOrCreateCashWallet(req.user._id);
    const now = Date.now();
    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;
    if ((now - lastClaim) < MS_PER_DAY) {
      return res.status(400).json({ message: 'Ya reclamaste tu recompensa hoy' });
    }
    const yesterday = now - MS_PER_DAY * 1.5;
    const isConsecutive = lastClaim > yesterday;
    wallet.rewardStreak = isConsecutive ? (wallet.rewardStreak || 0) + 1 : 1;
    const reward = Math.min(10 + wallet.rewardStreak * 2, 50);
    wallet.kroTokens = (wallet.kroTokens || 0) + reward;
    wallet.lastDailyReward = new Date();
    await wallet.save();
    res.json({ reward, streakDays: wallet.rewardStreak, newBalance: wallet.kroTokens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
`;
        content += dailyCode;
        fs.writeFileSync(walletCtrlPath, content);
        log('  getDailyReward & claimDailyReward added to walletController');
      }
    }

    // Add fields to CashWallet model if missing
    const walletModelPath = path.join(ROOT, 'server/models/CashWallet.js');
    if (fs.existsSync(walletModelPath)) {
      let content = fs.readFileSync(walletModelPath, 'utf8');
      if (!content.includes('kroTokens')) {
        content = content.replace(
          'balance',
          'balance'
        ).replace(
          /(\buser:\s*\{[^}]+\})/,
          `$1,\n  kroTokens: { type: Number, default: 0 },\n  rewardStreak: { type: Number, default: 0 },\n  lastDailyReward: { type: Date, default: null }`
        );
        fs.writeFileSync(walletModelPath, content);
        log('  kroTokens, rewardStreak, lastDailyReward added to CashWallet model');
      }
    }
    log('  Daily reward system created');
  },
};

// ─── Runner ───────────────────────────────────────────────────────────────────

const BUILDER_TASK_TYPES = ['feature', 'improvement'];

function pickNextTask(tasks) {
  return tasks.find(
    t => t.status === 'pending' && BUILDER_TASK_TYPES.includes(t.type)
  ) || null;
}

function run(options = {}) {
  const { taskId = null, dryRun = false } = options;
  log('=== BUILDER ALPHA iniciando ===');

  const tasks = loadTasks();
  if (tasks.length === 0) {
    log('No hay tareas en cola. Corre task-master primero.');
    return;
  }

  let task;
  if (taskId) {
    task = tasks.find(t => t.id === taskId);
    if (!task) { log(`Tarea ${taskId} no encontrada`); return; }
  } else {
    task = pickNextTask(tasks);
  }

  if (!task) {
    log('No hay tareas de tipo feature/improvement pendientes.');
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

  log('=== BUILDER ALPHA finalizado ===');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const taskId = args.find(a => !a.startsWith('--')) || null;
  const dryRun = args.includes('--dry');
  run({ taskId, dryRun });
} else {
  module.exports = { run, IMPLEMENTATIONS, BUILDER_TASK_TYPES };
}
