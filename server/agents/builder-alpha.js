const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TASKS_FILE = path.join(__dirname, 'tasks.json');
const LOG_FILE = path.join(__dirname, 'logs', 'builder-alpha.log');
const DONE_FILE = path.join(__dirname, 'logs', 'completed.json');

function log(msg) {
  const line = `[${new Date().toISOString()}] [BUILDER-ALPHA] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function loadTasks() { if (!fs.existsSync(TASKS_FILE)) return []; return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')); }
function saveTasks(tasks) { fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2)); }
function markTaskStatus(taskId, status, notes = '') { const tasks = loadTasks(); const idx = tasks.findIndex(t => t.id === taskId); if (idx === -1) return; tasks[idx].status = status; tasks[idx].updatedAt = new Date().toISOString(); if (notes) tasks[idx].notes = notes; saveTasks(tasks); }
function recordCompleted(task) { const list = fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, 'utf8')) : []; list.push({ ...task, completedAt: new Date().toISOString(), agent: 'builder-alpha' }); fs.writeFileSync(DONE_FILE, JSON.stringify(list, null, 2)); }
function ensureDir(filePath) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); }
function writeFile(relPath, content) { const abs = path.join(ROOT, relPath); ensureDir(abs); fs.writeFileSync(abs, content); log(`  Wrote: ${relPath}`); }
function fileExists(relPath) { return fs.existsSync(path.join(ROOT, relPath)); }

const IMPLEMENTATIONS = {
  'ui-loading-skeleton': () => {
    writeFile('client/src/components/kronos/Skeleton.jsx', `import React from 'react';\n\nfunction SkeletonBlock({ className = '' }) {\n  return (\n    <div\n      className={\`animate-pulse bg-white/10 rounded-lg \${className}\`}\n      aria-hidden="true"\n    />\n  );\n}\n\nexport function SkeletonCard() {\n  return (\n    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">\n      <div className="flex items-center gap-3">\n        <SkeletonBlock className="w-10 h-10 rounded-full" />\n        <div className="flex-1 space-y-2">\n          <SkeletonBlock className="h-3 w-1/3" />\n          <SkeletonBlock className="h-3 w-1/4" />\n        </div>\n      </div>\n      <SkeletonBlock className="h-32 w-full" />\n      <div className="flex gap-4">\n        <SkeletonBlock className="h-3 w-16" />\n        <SkeletonBlock className="h-3 w-16" />\n      </div>\n    </div>\n  );\n}\n\nexport function SkeletonList({ count = 4 }) {\n  return (\n    <div className="space-y-4">\n      {Array.from({ length: count }).map((_, i) => (\n        <SkeletonCard key={i} />\n      ))}\n    </div>\n  );\n}\n\nexport function SkeletonWalletCard() {\n  return (\n    <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-blue-900/20 space-y-4">\n      <div className="flex justify-between">\n        <SkeletonBlock className="h-4 w-20" />\n        <SkeletonBlock className="h-4 w-12" />\n      </div>\n      <SkeletonBlock className="h-8 w-40" />\n      <div className="flex gap-3">\n        <SkeletonBlock className="h-10 flex-1 rounded-xl" />\n        <SkeletonBlock className="h-10 flex-1 rounded-xl" />\n      </div>\n    </div>\n  );\n}\n\nexport default SkeletonBlock;\n`);
    log('  Skeleton component created');
  },
  'ui-dark-empty-states': () => {
    writeFile('client/src/components/kronos/EmptyState.jsx', `import React from 'react';\nimport { useNavigate } from 'react-router-dom';\n\nexport default function EmptyState({\n  icon = '🌌',\n  title = 'Nada por aquí',\n  subtitle = '',\n  ctaLabel = '',\n  ctaHref = '',\n  onCta = null,\n}) {\n  const navigate = useNavigate();\n  const handleCta = () => {\n    if (onCta) return onCta();\n    if (ctaHref) navigate(ctaHref);\n  };\n  return (\n    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">\n      <div className="text-6xl mb-4 select-none">{icon}</div>\n      <h3 className="text-xl font-semibold text-white/80 mb-2">{title}</h3>\n      {subtitle && <p className="text-white/40 text-sm mb-6 max-w-xs">{subtitle}</p>}\n      {ctaLabel && (\n        <button\n          onClick={handleCta}\n          className="px-6 py-2 rounded-full text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"\n        >\n          {ctaLabel}\n        </button>\n      )}\n    </div>\n  );\n}\n`);
    log('  EmptyState component created');
  },
  'ui-toast-system': () => {
    writeFile('client/src/hooks/useToast.js', `import toast from 'react-hot-toast';\n\nexport function useToast() {\n  return {\n    success: (msg) => toast.success(msg),\n    error: (msg) =>\n      toast.error(msg, {\n        style: {\n          background: 'rgba(15,15,26,0.95)',\n          color: '#fff',\n          border: '1px solid rgba(239,68,68,0.4)',\n        },\n      }),\n    info: (msg) =>\n      toast(msg, {\n        icon: 'ℹ️',\n        style: {\n          background: 'rgba(15,15,26,0.95)',\n          color: '#fff',\n          border: '1px solid rgba(179,68,255,0.3)',\n        },\n      }),\n    loading: (msg) => toast.loading(msg),\n    dismiss: (id) => toast.dismiss(id),\n  };\n}\n\nexport default useToast;\n`);
    log('  useToast hook created');
  },
  'api-search-debounce': () => {
    const searchPath = 'client/src/pages/Search.jsx';
    if (!fileExists(searchPath)) { log('  Search.jsx not found, skipping'); return; }
    let content = fs.readFileSync(path.join(ROOT, searchPath), 'utf8');
    if (!content.includes('useDebounce') && !content.includes('debounceTimeout')) {
      const hookCode = `\nfunction useDebounce(value, delay = 300) {\n  const [debounced, setDebounced] = React.useState(value);\n  React.useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}\n`;
      content = content.replace(/^(import React.*|import \{ .* \} from 'react')/m, `$1${hookCode}`);
      fs.writeFileSync(path.join(ROOT, searchPath), content);
      log('  useDebounce injected into Search.jsx');
    } else {
      log('  Search.jsx already has debounce, skipping');
    }
  },
  'feat-notifications-center': () => {
    writeFile('server/models/Notification.js', `const mongoose = require('mongoose');\n\nconst notificationSchema = new mongoose.Schema(\n  {\n    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },\n    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n    type: {\n      type: String,\n      enum: ['like', 'comment', 'follow', 'message', 'transfer', 'community_invite', 'story_reaction'],\n      required: true,\n    },\n    title: { type: String, required: true },\n    body: { type: String, default: '' },\n    link: { type: String, default: '' },\n    read: { type: Boolean, default: false, index: true },\n    meta: { type: mongoose.Schema.Types.Mixed, default: {} },\n  },\n  { timestamps: true }\n);\n\nnotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });\n\nmodule.exports = mongoose.model('Notification', notificationSchema);\n`);
    writeFile('server/controllers/notificationController.js', `const Notification = require('../models/Notification');\n\nexports.getNotifications = async (req, res) => {\n  try {\n    const notifications = await Notification.find({ recipient: req.user._id })\n      .sort({ createdAt: -1 })\n      .limit(50)\n      .populate('sender', 'username avatar');\n    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });\n    res.json({ notifications, unreadCount });\n  } catch (err) {\n    res.status(500).json({ message: 'Error al obtener notificaciones' });\n  }\n};\n\nexports.markAllRead = async (req, res) => {\n  try {\n    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });\n    res.json({ message: 'Notificaciones marcadas como leídas' });\n  } catch (err) {\n    res.status(500).json({ message: 'Error al actualizar notificaciones' });\n  }\n};\n\nexports.markOneRead = async (req, res) => {\n  try {\n    await Notification.findOneAndUpdate(\n      { _id: req.params.id, recipient: req.user._id },\n      { read: true }\n    );\n    res.json({ message: 'OK' });\n  } catch (err) {\n    res.status(500).json({ message: 'Error al actualizar notificación' });\n  }\n};\n\nexports.createNotification = async ({ recipient, sender, type, title, body = '', link = '', meta = {} }) => {\n  if (recipient?.toString() === sender?.toString()) return;\n  return Notification.create({ recipient, sender, type, title, body, link, meta });\n};\n`);
    writeFile('server/routes/notifications.js', `const express = require('express');\nconst router = express.Router();\nconst { protect } = require('../middleware/auth');\nconst { getNotifications, markAllRead, markOneRead } = require('../controllers/notificationController');\n\nrouter.get('/', protect, getNotifications);\nrouter.put('/read-all', protect, markAllRead);\nrouter.put('/:id/read', protect, markOneRead);\n\nmodule.exports = router;\n`);
    writeFile('client/src/components/NotificationCenter.jsx', `import React, { useState, useEffect, useCallback } from 'react';\nimport axios from 'axios';\nimport { useNavigate } from 'react-router-dom';\n\nconst API = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n\nexport default function NotificationCenter() {\n  const [open, setOpen] = useState(false);\n  const [notifications, setNotifications] = useState([]);\n  const [unread, setUnread] = useState(0);\n  const navigate = useNavigate();\n\n  const fetchNotifications = useCallback(async () => {\n    try {\n      const token = localStorage.getItem('token');\n      if (!token) return;\n      const { data } = await axios.get(`${API}/api/notifications`, {\n        headers: { Authorization: `Bearer ${token}` },\n      });\n      setNotifications(data.notifications);\n      setUnread(data.unreadCount);\n    } catch {}\n  }, []);\n\n  useEffect(() => {\n    fetchNotifications();\n    const interval = setInterval(fetchNotifications, 30000);\n    return () => clearInterval(interval);\n  }, [fetchNotifications]);\n\n  const markAllRead = async () => {\n    try {\n      const token = localStorage.getItem('token');\n      await axios.put(`${API}/api/notifications/read-all`, {}, {\n        headers: { Authorization: `Bearer ${token}` },\n      });\n      setUnread(0);\n      setNotifications(prev => prev.map(n => ({ ...n, read: true })));\n    } catch {}\n  };\n\n  const handleClick = async (notif) => {\n    if (!notif.read) {\n      const token = localStorage.getItem('token');\n      await axios.put(`${API}/api/notifications/${notif._id}/read`, {}, {\n        headers: { Authorization: `Bearer ${token}` },\n      }).catch(() => {});\n      setNotifications(prev => prev.map(n => (n._id === notif._id ? { ...n, read: true } : n)));\n      setUnread(prev => Math.max(0, prev - 1));\n    }\n    if (notif.link) navigate(notif.link);\n    setOpen(false);\n  };\n\n  return (\n    <div className="relative">\n      <button\n        onClick={() => setOpen(o => !o)}\n        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"\n      >\n        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />\n        </svg>\n        {unread > 0 && (\n          <span className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">\n            {unread > 9 ? '9+' : unread}\n          </span>\n        )}\n      </button>\n      {open && (\n        <>\n          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />\n          <div className="absolute right-0 top-10 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl">\n            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">\n              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>\n              {unread > 0 && (\n                <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300">\n                  Marcar todas\n                </button>\n              )}\n            </div>\n            {notifications.length === 0 ? (\n              <div className="py-12 text-center text-white/30 text-sm">Sin notificaciones</div>\n            ) : (\n              notifications.map(n => (\n                <button\n                  key={n._id}\n                  onClick={() => handleClick(n)}\n                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${!n.read ? 'bg-purple-900/20' : ''}`}\n                >\n                  <p className="text-sm text-white/90 font-medium">{n.title}</p>\n                  {n.body && <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{n.body}</p>}\n                  <p className="text-[10px] text-white/30 mt-1">{new Date(n.createdAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}</p>\n                </button>\n              ))\n            )}\n          </div>\n        </>\n      )}\n    </div>\n  );\n}\n`);
    log('  Notification system created (model + controller + routes + component')); log('  NOTE: Remember to register /api/notifications in server.js');
  },
  'ui-notif-in-navbar': () => {
    const navPath = path.join(ROOT, 'client/src/components/Navbar.jsx');
    if (!fs.existsSync(navPath)) { log('  Navbar.jsx not found'); return; }
    let content = fs.readFileSync(navPath, 'utf8');
    if (content.includes('NotificationCenter')) { log('  Already integrated'); return; }
    content = content.replace(/^(import React.*|import \{[^}]+\} from 'react')/m, `$1\nimport NotificationCenter from './NotificationCenter';`);
    content = content.replace(/<span[^>]*>🔔<\/span>/, `<NotificationCenter />`);
    fs.writeFileSync(navPath, content);
    log('  NotificationCenter injected into Navbar');
  },
  'ui-skeleton-wallet': () => {
    const walletPath = path.join(ROOT, 'client/src/pages/Wallet.jsx');
    if (!fs.existsSync(walletPath)) { log('  Wallet.jsx not found'); return; }
    let content = fs.readFileSync(walletPath, 'utf8');
    if (content.includes('SkeletonWalletCard')) { log('  Already has skeleton'); return; }
    content = content.replace(/import React/, `import { SkeletonWalletCard, SkeletonList } from '../components/kronos';\nimport React`);
    content = content.replace(/loading\s*&&\s*<[^>]+>Cargando[^<]*<\/[^>]+>/, `loading && <div style={{padding:'0 16px'}}><SkeletonWalletCard /><SkeletonList count={3} /></div>`);
    fs.writeFileSync(walletPath, content);
    log('  SkeletonWalletCard applied to Wallet.jsx');
  },
  'ui-skeleton-communities': () => {
    const commPath = path.join(ROOT, 'client/src/pages/Communities.jsx');
    if (!fs.existsSync(commPath)) { log('  Communities.jsx not found'); return; }
    let content = fs.readFileSync(commPath, 'utf8');
    if (content.includes('SkeletonList')) { log('  Already has skeleton'); return; }
    content = content.replace(/import React/, `import { SkeletonList } from '../components/kronos';\nimport React`);
    content = content.replace(/loading \? \(\s*<div[^>]+>Cargando\.\.\.<\/div>\s*\)/, `loading ? (<div style={{padding:'0 16px'}}><SkeletonList count={4} /></div>)`);
    fs.writeFileSync(commPath, content);
    log('  SkeletonList applied to Communities.jsx');
  },
  'feat-trending-hashtags': () => {
    writeFile('client/src/components/HashtagText.jsx', `import React from 'react';\nimport { useNavigate } from 'react-router-dom';\n\nconst HASHTAG_RE = /(#[\\w\\u00C0-\\u017F]+)/g;\n\nexport default function HashtagText({ text, style = {} }) {\n  const navigate = useNavigate();\n  if (!text) return null;\n  const parts = text.split(HASHTAG_RE);\n  return (\n    <span style={style}>\n      {parts.map((part, i) =>\n        HASHTAG_RE.test(part) ? (\n          <span\n            key={i}\n            onClick={e => { e.stopPropagation(); navigate(`/search?q=${encodeURIComponent(part.slice(1))}`); }}\n            style={{ color: '#a855f7', cursor: 'pointer', fontWeight: 600 }}\n          >\n            {part}\n          </span>\n        ) : (\n          <React.Fragment key={i}>{part}</React.Fragment>\n        )\n      )}\n    </span>\n  );\n}\n`);
    log('  HashtagText component created');
  },
  'feat-search-history': () => {
    const searchPath = path.join(ROOT, 'client/src/pages/Search.jsx');
    if (!fs.existsSync(searchPath)) { log('  Search.jsx not found'); return; }
    let content = fs.readFileSync(searchPath, 'utf8');
    if (content.includes('searchHistory') || content.includes('SEARCH_HISTORY')) { log('  Search history already present'); return; }
    const historyHook = `\nconst HISTORY_KEY = 'kronos_search_history';\nfunction useSearchHistory() {\n  const get = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } };\n  const add = (q) => {\n    if (!q.trim()) return;\n    const list = [q, ...get().filter(h => h !== q)].slice(0, 8);\n    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));\n  };\n  const clear = () => localStorage.removeItem(HISTORY_KEY);\n  return { get, add, clear };\n}\n`;
    content = content.replace(/^(import .+\n)+/m, match => match + historyHook);
    fs.writeFileSync(searchPath, content);
    log('  useSearchHistory hook injected into Search.jsx');
  },
  'api-compress-responses': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('compression')) { log('  Compression already added'); return; }
    content = content.replace("const express = require('express');", "const express = require('express');\nconst compression = require('compression');");
    content = content.replace('app.use(express.json());', 'app.use(compression());\napp.use(express.json());');
    fs.writeFileSync(serverPath, content);
    log('  Compression middleware added to server.js');
    log('  NOTE: Run "npm install compression" in /server');
  },
  'api-morgan-logging': () => {
    const serverPath = path.join(ROOT, 'server/server.js');
    if (!fs.existsSync(serverPath)) { log('  server.js not found'); return; }
    let content = fs.readFileSync(serverPath, 'utf8');
    if (content.includes('morgan')) { log('  Morgan already added'); return; }
    content = content.replace("const express = require('express');", "const express = require('express');\nconst morgan = require('morgan');");
    content = content.replace('app.use(express.json());', `app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));\napp.use(express.json());`);
    fs.writeFileSync(serverPath, content);
    log('  Morgan logging added to server.js');
    log('  NOTE: Run "npm install morgan" in /server');
  },
  'feat-token-daily-reward': () => {
    const walletRoutePath = path.join(ROOT, 'server/routes/wallet.js');
    if (fs.existsSync(walletRoutePath)) {
      let content = fs.readFileSync(walletRoutePath, 'utf8');
      if (!content.includes('daily-reward')) {
        content = content.replace('module.exports = router;', `router.get('/daily-reward', protect, require('../controllers/walletController').getDailyReward);\nrouter.post('/daily-reward', protect, require('../controllers/walletController').claimDailyReward);\n\nmodule.exports = router;`);
        fs.writeFileSync(walletRoutePath, content);
        log('  Daily reward routes added to wallet router');
      }
    }
    const walletCtrlPath = path.join(ROOT, 'server/controllers/walletController.js');
    if (fs.existsSync(walletCtrlPath)) {
      let content = fs.readFileSync(walletCtrlPath, 'utf8');
      if (!content.includes('getDailyReward')) {
        const dailyCode = `\nconst MS_PER_DAY = 86400000;\n\nexports.getDailyReward = async (req, res) => {\n  try {\n    const wallet = await getOrCreateCashWallet(req.user._id);\n    const now = Date.now();\n    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;\n    const claimed = (now - lastClaim) < MS_PER_DAY;\n    const streakDays = wallet.rewardStreak || 0;\n    const reward = Math.min(10 + streakDays * 2, 50);\n    res.json({ claimed, streakDays, reward, nextClaimAt: claimed ? lastClaim + MS_PER_DAY : null });\n  } catch (err) {\n    res.status(500).json({ message: err.message });\n  }\n};\n\nexports.claimDailyReward = async (req, res) => {\n  try {\n    const wallet = await getOrCreateCashWallet(req.user._id);\n    const now = Date.now();\n    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;\n    if ((now - lastClaim) < MS_PER_DAY) {\n      return res.status(400).json({ message: 'Ya reclamaste tu recompensa hoy' });\n    }\n    const yesterday = now - MS_PER_DAY * 1.5;\n    const isConsecutive = lastClaim > yesterday;\n    wallet.rewardStreak = isConsecutive ? (wallet.rewardStreak || 0) + 1 : 1;\n    const reward = Math.min(10 + wallet.rewardStreak * 2, 50);\n    wallet.kroTokens = (wallet.kroTokens || 0) + reward;\n    wallet.lastDailyReward = new Date();\n    await wallet.save();\n    res.json({ reward, streakDays: wallet.rewardStreak, newBalance: wallet.kroTokens });\n  } catch (err) {\n    res.status(500).json({ message: err.message });\n  }\n};\n`;
        content += dailyCode;
        fs.writeFileSync(walletCtrlPath, content);
        log('  getDailyReward & claimDailyReward added to walletController');
      }
    }
    const walletModelPath = path.join(ROOT, 'server/models/CashWallet.js');
    if (fs.existsSync(walletModelPath)) {
      let content = fs.readFileSync(walletModelPath, 'utf8');
      if (!content.includes('kroTokens')) {
        content = content.replace('balance', 'balance').replace(/(\buser:\s*\{[^}]+\})/, `$1,\n  kroTokens: { type: Number, default: 0 },\n  rewardStreak: { type: Number, default: 0 },\n  lastDailyReward: { type: Date, default: null }`);
        fs.writeFileSync(walletModelPath, content);
        log('  kroTokens, rewardStreak, lastDailyReward added to CashWallet model');
      }
    }
    log('  Daily reward system created');
  },
};

const BUILDER_TASK_TYPES = ['feature', 'improvement'];
function pickNextTask(tasks) { return tasks.find(t => t.status === 'pending' && BUILDER_TASK_TYPES.includes(t.type)) || null; }
function run(options = {}) { const { taskId = null, dryRun = false } = options; log('=== BUILDER ALPHA iniciando ==='); const tasks = loadTasks(); if (tasks.length === 0) { log('No hay tareas en cola. Corre task-master primero.'); return; } let task; if (taskId) { task = tasks.find(t => t.id === taskId); if (!task) { log(`Tarea ${taskId} no encontrada`); return; } } else { task = pickNextTask(tasks); } if (!task) { log('No hay tareas de tipo feature/improvement pendientes.'); return; } log(`Ejecutando tarea: [${task.id}] ${task.title}`); if (dryRun) { log('DRY RUN — no se escriben archivos'); return; } const impl = IMPLEMENTATIONS[task.id]; if (!impl) { log(`  Sin implementación automática para ${task.id}. Marcando como needs_human.`); markTaskStatus(task.id, 'needs_human', 'No hay implementación automática registrada'); return; } try { markTaskStatus(task.id, 'in_progress'); impl(); markTaskStatus(task.id, 'done'); recordCompleted(task); log(`Tarea [${task.id}] COMPLETADA`); } catch (err) { log(`ERROR en tarea [${task.id}]: ${err.message}`); markTaskStatus(task.id, 'error', err.message); } log('=== BUILDER ALPHA finalizado ==='); }
if (require.main === module) { const args = process.argv.slice(2); const taskId = args.find(a => !a.startsWith('--')) || null; const dryRun = args.includes('--dry'); run({ taskId, dryRun }); } else { module.exports = { run, IMPLEMENTATIONS, BUILDER_TASK_TYPES }; }