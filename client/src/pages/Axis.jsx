import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';

// ─── Paywall ────────────────────────────────────────────────────────────────
function AxisPaywall() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', background: '#08080f',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(109,40,217,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Lock icon */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 34, marginBottom: 24,
        boxShadow: '0 0 50px rgba(212,175,55,0.4)',
      }}>🔒</div>

      <div style={{
        fontSize: 28, fontWeight: 900, letterSpacing: 2, marginBottom: 10,
        background: 'linear-gradient(90deg, #A08820, #D4AF37, #F0D060)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        AXIS — AI 3D Design Agent
      </div>

      <div style={{ color: 'rgba(240,240,248,0.5)', fontSize: 14, textAlign: 'center', maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
        Genera arquitecturas 3D completas con código Three.js, React Three Fiber o WebGPU usando IA.
        Disponible para suscriptores <strong style={{ color: '#F0D060' }}>Pro</strong> y <strong style={{ color: '#D4AF37' }}>Business</strong>.
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/pricing')} style={{
          padding: '13px 32px', borderRadius: 12,
          background: 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)',
          border: 'none', color: '#08080f', fontWeight: 800, fontSize: 14,
          cursor: 'pointer', letterSpacing: 1, fontFamily: 'inherit',
          boxShadow: '0 4px 24px rgba(212,175,55,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,175,55,0.45)'; }}
        >
          VER PLANES
        </button>
        <button onClick={() => navigate('/feed')} style={{
          padding: '13px 28px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(212,175,55,0.2)',
          color: 'rgba(212,175,55,0.7)', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Volver
        </button>
      </div>

      {/* Feature list */}
      <div style={{
        marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, maxWidth: 700, width: '100%',
      }}>
        {[
          { icon: '◈', label: 'Arquitectura modular', desc: 'Nodos 3D conectados con lógica real' },
          { icon: '⚡', label: 'Código generado', desc: 'Three.js, R3F, WebGPU o OpenGL' },
          { icon: '⬡', label: 'Canvas interactivo', desc: 'Pan, zoom y tooltips en tiempo real' },
          { icon: '≡', label: 'Specs técnicas', desc: 'FPS, draw calls, pipeline de render' },
        ].map(f => (
          <div key={f.label} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(212,175,55,0.1)',
            borderRadius: 14, padding: '16px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8, color: '#D4AF37' }}>{f.icon}</div>
            <div style={{ color: '#F0D060', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{f.label}</div>
            <div style={{ color: 'rgba(240,240,248,0.4)', fontSize: 11 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main AXIS App ───────────────────────────────────────────────────────────
export default function Axis() {
  const { tier, loading: subLoading } = useSubscription();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animIdRef = useRef(null);
  const animTRef = useRef(0);
  const viewRef = useRef({ scale: 1, x: 0, y: 0 });
  const dragRef = useRef({ active: false, sx: 0, sy: 0, vx: 0, vy: 0 });
  const hoveredRef = useRef(null);
  const currentArchRef = useRef(null);

  const [arch, setArch] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | done | err
  const [concept, setConcept] = useState('');
  const [outputType, setOutputType] = useState('code');
  const [modCount, setModCount] = useState(6);
  const [codeDetail, setCodeDetail] = useState(2);
  const [activeTab, setActiveTab] = useState('code');
  const [history, setHistory] = useState([]);
  const [codeHtml, setCodeHtml] = useState('');
  const [copied, setCopied] = useState(false);

  // Paywall check
  const isPremium = tier === 'pro' || tier === 'business';

  // ── Canvas setup ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const area = canvas.parentElement;
    canvas.width = area.clientWidth;
    canvas.height = area.clientHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ── Idle animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPremium) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    let id;
    function idleLoop() {
      if (currentArchRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() * 0.0008;
      const colors = ['rgba(109,40,217,.06)', 'rgba(6,182,212,.04)', 'rgba(212,175,55,.04)'];
      for (let i = 0; i < 3; i++) {
        const x = canvas.width / 2 + Math.cos(t + i * Math.PI * 0.667) * 80;
        const y = canvas.height / 2 + Math.sin(t * 0.8 + i * Math.PI * 0.667) * 50;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 120);
        g.addColorStop(0, colors[i]);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 120, 0, Math.PI * 2);
        ctx.fill();
      }
      id = requestAnimationFrame(idleLoop);
    }
    idleLoop();
    return () => cancelAnimationFrame(id);
  }, [isPremium]);

  // ── World to screen ────────────────────────────────────────────────────────
  const w2s = useCallback((x, y) => {
    const canvas = canvasRef.current;
    const v = viewRef.current;
    return [
      (x - 400) * v.scale + canvas.width / 2 + v.x,
      (y - 250) * v.scale + canvas.height / 2 + v.y,
    ];
  }, []);

  // ── Draw frame ────────────────────────────────────────────────────────────
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const a = currentArchRef.current;
    if (!canvas || !ctx || !a) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const v = viewRef.current;
    const t = animTRef.current;

    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(28,28,48,.5)';
    ctx.lineWidth = 1;
    const gs = 40 * v.scale;
    const ox = ((v.x % gs) + gs) % gs;
    const oy = ((v.y % gs) + gs) % gs;
    for (let x = ox; x < canvas.width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = oy; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    ctx.restore();

    const mods = a.modules || [];
    const conns = a.connections || [];

    // Connections
    conns.forEach(conn => {
      const from = mods.find(m => m.id === conn.from);
      const to = mods.find(m => m.id === conn.to);
      if (!from || !to) return;
      const [fx, fy] = w2s(from.x, from.y);
      const [tx2, ty2] = w2s(to.x, to.y);
      ctx.save();
      ctx.strokeStyle = conn.type === 'primary' ? from.color : 'rgba(100,100,180,.3)';
      ctx.lineWidth = conn.type === 'primary' ? 1.5 * v.scale : 1 * v.scale;
      ctx.globalAlpha = 0.35 + Math.sin(t * 2 + from.x * 0.01) * 0.15;
      ctx.setLineDash(conn.type === 'data' ? [6 * v.scale, 8 * v.scale] : []);
      ctx.lineDashOffset = -t * 15;
      ctx.beginPath();
      const mx = (fx + tx2) / 2, my = (fy + ty2) / 2;
      const perp = { x: -(ty2 - fy), y: tx2 - fx };
      const len = Math.sqrt(perp.x * perp.x + perp.y * perp.y) || 1;
      const cpx = mx + (perp.x / len) * 30 * v.scale * 0.3;
      const cpy = my + (perp.y / len) * 30 * v.scale * 0.3;
      ctx.moveTo(fx, fy); ctx.quadraticCurveTo(cpx, cpy, tx2, ty2);
      ctx.stroke();
      // Packet
      if (conn.type !== 'secondary') {
        const prog = ((t * 0.4 + (from.x + from.y) * 0.002) % 1);
        const bx = fx + (tx2 - fx) * prog;
        const by = fy + (ty2 - fy) * prog;
        ctx.fillStyle = from.color || '#6d28d9';
        ctx.shadowBlur = 8; ctx.shadowColor = from.color || '#6d28d9';
        ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(bx, by, 2.5 * v.scale, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    // Nodes
    const icons = { core:'◈',renderer:'⬡',physics:'◎',ui:'▦',data:'≡',audio:'♦',network:'⊕',scene:'⬟',camera:'⊙',shader:'✦' };
    mods.forEach((mod, i) => {
      const [sx, sy] = w2s(mod.x, mod.y);
      const r = ((mod.size || 52) / 2) * v.scale;
      const isHov = hoveredRef.current === mod;
      const pulse = Math.sin(t * 1.8 + i * 0.7) * 0.12 + 1;
      const fr = r * (isHov ? 1.12 : pulse);
      ctx.save();
      // Glow
      const grad = ctx.createRadialGradient(sx, sy, fr * 0.5, sx, sy, fr * 2.2);
      grad.addColorStop(0, (mod.color || '#6d28d9') + '55');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(sx, sy, fr * 2.2, 0, Math.PI * 2); ctx.fill();
      // Body
      ctx.beginPath(); ctx.arc(sx, sy, fr, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(sx - fr * 0.3, sy - fr * 0.3, 0, sx, sy, fr);
      bg.addColorStop(0, (mod.color || '#6d28d9') + 'ee');
      bg.addColorStop(1, (mod.color || '#6d28d9') + '88');
      ctx.fillStyle = bg;
      ctx.shadowBlur = isHov ? 30 : 14;
      ctx.shadowColor = mod.color || '#6d28d9';
      ctx.fill();
      ctx.strokeStyle = isHov ? '#D4AF37' : mod.color || '#6d28d9';
      ctx.lineWidth = (isHov ? 2.5 : 1.5) * v.scale;
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.restore();
      // Icon
      ctx.save();
      ctx.font = `${14 * v.scale}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.9;
      ctx.fillText(icons[mod.type] || '◈', sx, sy);
      ctx.restore();
      // Label
      if (v.scale > 0.45) {
        ctx.save();
        ctx.font = `${Math.max(7, 9 * v.scale)}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center'; ctx.fillStyle = '#e2e8f0'; ctx.globalAlpha = 0.9;
        ctx.fillText(mod.name, sx, sy + fr + 12 * v.scale);
        ctx.font = `${Math.max(6, 7 * v.scale)}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = mod.color || '#6d28d9'; ctx.globalAlpha = 0.65;
        ctx.fillText((mod.type || '').toUpperCase(), sx, sy + fr + 24 * v.scale);
        ctx.restore();
      }
    });

    // Tooltip
    if (hoveredRef.current) {
      const mod = hoveredRef.current;
      const [sx, sy] = w2s(mod.x, mod.y);
      const r = ((mod.size || 52) / 2) * v.scale;
      const tx3 = Math.min(sx + r + 10, canvas.width - 220);
      const ty3 = Math.max(10, sy - 30);
      ctx.save();
      ctx.fillStyle = 'rgba(8,8,15,.96)';
      ctx.strokeStyle = mod.color || '#6d28d9'; ctx.lineWidth = 1;
      roundRect(ctx, tx3, ty3, 200, 58, 6); ctx.fill(); ctx.stroke();
      ctx.font = 'bold 10px Outfit, sans-serif'; ctx.fillStyle = mod.color || '#e2e8f0';
      ctx.fillText(mod.name, tx3 + 10, ty3 + 16);
      ctx.font = '8.5px JetBrains Mono, monospace'; ctx.fillStyle = '#94a3b8';
      const words = (mod.description || '').split(' ');
      let line = '', lines2 = [];
      words.forEach(w => {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > 180 && line) { lines2.push(line.trim()); line = w + ' '; }
        else line = test;
      });
      if (line) lines2.push(line.trim());
      lines2.slice(0, 2).forEach((l, i) => ctx.fillText(l, tx3 + 10, ty3 + 33 + i * 13));
      ctx.restore();
    }
  }, [w2s]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const startAnimation = useCallback((a) => {
    currentArchRef.current = a;
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    function loop() {
      animTRef.current += 0.016;
      drawFrame();
      animIdRef.current = requestAnimationFrame(loop);
    }
    loop();
  }, [drawFrame]);

  // ── Canvas events ─────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y };
  };
  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (d.active) {
      viewRef.current.x = d.vx + e.clientX - d.sx;
      viewRef.current.y = d.vy + e.clientY - d.sy;
      return;
    }
    if (!currentArchRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const v = viewRef.current;
    const mx = (e.clientX - rect.left - canvasRef.current.width / 2 - v.x) / v.scale + 400;
    const my = (e.clientY - rect.top - canvasRef.current.height / 2 - v.y) / v.scale + 250;
    hoveredRef.current = currentArchRef.current.modules?.find(m => {
      const dx = mx - m.x, dy = my - m.y;
      return Math.sqrt(dx * dx + dy * dy) < (m.size || 52) / 2 + 10;
    }) || null;
  };
  const onMouseUp = () => { dragRef.current.active = false; };
  const onWheel = (e) => {
    e.preventDefault();
    const f = e.deltaY > 0 ? 0.9 : 1.1;
    viewRef.current.scale = Math.max(0.3, Math.min(3, viewRef.current.scale * f));
  };

  // ── Syntax highlight ──────────────────────────────────────────────────────
  function syntaxHL(code) {
    return code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#5c6370;font-style:italic">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color:#98c379">$1$2$3</span>')
      .replace(/\b(import|export|const|let|var|function|class|extends|new|return|if|else|for|while|async|await|from|of|in|default|this)\b/g, '<span style="color:#c678dd">$1</span>')
      .replace(/\b(THREE|Scene|Renderer|Camera|Mesh|Geometry|Material|Light|Group|Vector3|Color|Clock|WebGLRenderer)\b/g, '<span style="color:#e5c07b">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#d19a66">$1</span>');
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    if (!concept.trim()) return;
    setStatus('loading');
    hoveredRef.current = null;

    const detailLabel = ['básico con comentarios esenciales', 'medio con estructura completa', 'completo con documentación JSDoc'][codeDetail - 1];
    const outputLabel = { code: 'Three.js', react: 'React Three Fiber', webgpu: 'WebGPU nativo', native: 'OpenGL con WebAssembly' }[outputType];

    const systemPrompt = `Eres AXIS, un agente experto en arquitectura de aplicaciones 3D.
Dado un concepto de aplicación, diseña la arquitectura modular completa.

RESPONDE ÚNICAMENTE CON JSON VÁLIDO, sin texto adicional, sin markdown, sin backticks.

Estructura requerida:
{
  "appName": "Nombre",
  "description": "Descripción breve",
  "techStack": ["Three.js", "WebGL"],
  "modules": [{"id":"uid","name":"NOMBRE","type":"core|renderer|physics|ui|data|audio|network|scene|camera|shader","description":"Función","color":"#hexcolor","x":400,"y":250,"size":52}],
  "connections": [{"from":"id1","to":"id2","label":"desc","type":"primary|secondary|data"}],
  "codeSnippet": "// Código ${outputLabel} nivel ${detailLabel}",
  "specs": {"renderPipeline":"...","estimatedFPS":"...","targetHardware":"...","sceneComplexity":"...","drawCalls":"...","polygonCount":"..."}
}

POSICIONAMIENTO: distribuye ${modCount} módulos en 800x500px. Core cerca del centro (x:380-420,y:220-260). Distancia mínima 140px entre nodos.
COLORES: core=#6d28d9, renderer=#6d28d9, physics=#ef4444, data=#06b6d4, ui=#10b981, audio=#f59e0b, network=#3b82f6, scene=#8b5cf6, camera=#8b5cf6, shader=#ec4899`;

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 3500,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Diseña la arquitectura 3D para: "${concept}"` }],
        }),
      });

      const data = await resp.json();

      if (data.error) throw new Error(data.error.message || 'API error');

      const raw = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(clean);

      setArch(result);
      currentArchRef.current = result;
      setCodeHtml(syntaxHL(result.codeSnippet || ''));
      setHistory(h => [{ concept, arch: result, time: new Date().toLocaleTimeString('es-MX', { hour12: false }) }, ...h].slice(0, 8));
      setStatus('done');
      setActiveTab('code');
      viewRef.current = { scale: 1, x: 0, y: 0 };
      startAnimation(result);
    } catch (err) {
      console.error(err);
      setStatus('err');
      setCodeHtml(`<span style="color:#ef4444">// Error: ${err.message}</span>`);
    }
  };

  const resetView = () => { viewRef.current = { scale: 1, x: 0, y: 0 }; };
  const zoomIn  = () => { viewRef.current.scale = Math.min(viewRef.current.scale * 1.2, 3); };
  const zoomOut = () => { viewRef.current.scale = Math.max(viewRef.current.scale / 1.2, 0.3); };

  const copyCode = () => {
    navigator.clipboard.writeText(arch?.codeSnippet || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (subLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(212,175,55,0.5)', fontFamily: "'Outfit',sans-serif", letterSpacing: 2 }}>Cargando...</div>
      </div>
    );
  }

  if (!isPremium) return <AxisPaywall />;

  // ── UI ────────────────────────────────────────────────────────────────────
  const statusConfig = {
    idle:    { color: '#64748b', label: 'LISTO' },
    loading: { color: '#8b5cf6', label: 'ANALIZANDO...' },
    done:    { color: '#10b981', label: 'COMPLETO' },
    err:     { color: '#ef4444', label: 'ERROR' },
  }[status];

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr',
      gridTemplateColumns: '300px 1fr 320px',
      height: '100vh',
      background: '#08080f',
      fontFamily: "'Outfit', sans-serif",
      color: '#e2e8f0',
      overflow: 'hidden',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        gridColumn: '1/-1',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
        borderBottom: '1px solid #1c1c30',
        background: '#0f0f1c',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: '#6d28d9', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: -1,
          }}>AX</div>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: '#e2e8f0' }}>AXIS</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#64748b',
            background: '#1c1c30', padding: '2px 6px', borderRadius: 3,
          }}>v1.0 · AI 3D DESIGN AGENT</span>
          {/* Kronos Pro badge */}
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))',
            border: '1px solid rgba(212,175,55,0.35)', color: '#F0D060',
            letterSpacing: 1,
          }}>KRONOS {tier.toUpperCase()}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            padding: '4px 12px', borderRadius: 20,
            border: `1px solid ${statusConfig.color}`,
            color: statusConfig.color,
            display: 'flex', alignItems: 'center', gap: 6,
            animation: status === 'loading' ? 'axis-pulse 1.2s ease infinite' : 'none',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusConfig.color }} />
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ background: '#0f0f1c', borderRight: '1px solid #1c1c30', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 3, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>
            Concepto de Aplicación
          </div>
          <textarea
            value={concept}
            onChange={e => setConcept(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate(); }}
            placeholder={"Describe tu app 3D...\nEj: Dashboard analítico con gráficas volumétricas"}
            style={{
              width: '100%', background: '#141425', border: '1px solid #1c1c30',
              borderRadius: 8, padding: 12, color: '#e2e8f0',
              fontFamily: "'Outfit',sans-serif", fontSize: 13, resize: 'none', height: 88,
              outline: 'none', lineHeight: 1.5, boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = '#6d28d9'; }}
            onBlur={e => { e.target.style.borderColor = '#1c1c30'; }}
          />

          {/* Output type */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 3, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>Tipo de Salida</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[['code','Three.js'],['react','React+R3F'],['webgpu','WebGPU'],['native','OpenGL']].map(([val, label]) => (
              <button key={val} onClick={() => setOutputType(val)} style={{
                padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 0.5,
                background: outputType === val ? 'rgba(109,40,217,.35)' : 'transparent',
                border: `1px solid ${outputType === val ? '#6d28d9' : '#1c1c30'}`,
                color: outputType === val ? '#8b5cf6' : '#64748b',
                transition: 'all .2s',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 3, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>Complejidad</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: '#64748b', marginBottom: 4 }}>
              <span>Módulos</span><span style={{ color: '#8b5cf6' }}>{modCount}</span>
            </div>
            <input type="range" min={3} max={12} value={modCount} onChange={e => setModCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6d28d9', height: 3 }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: '#64748b', marginBottom: 4 }}>
              <span>Detalle</span><span style={{ color: '#8b5cf6' }}>{['Básico','Medio','Completo'][codeDetail-1]}</span>
            </div>
            <input type="range" min={1} max={3} value={codeDetail} onChange={e => setCodeDetail(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6d28d9', height: 3 }} />
          </div>

          {/* Generate button */}
          <button onClick={generate} disabled={status === 'loading'} style={{
            width: '100%', marginTop: 14, padding: 12, borderRadius: 8, border: 'none',
            background: status === 'loading' ? '#4c1d95' : '#6d28d9',
            color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.6 : 1,
            transition: 'all .2s',
          }}
            onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = '#7c3aed'; }}
            onMouseLeave={e => { e.currentTarget.style.background = status === 'loading' ? '#4c1d95' : '#6d28d9'; }}
          >
            {status === 'loading' ? '⟳ Generando...' : '⚡ GENERAR ARQUITECTURA'}
          </button>
        </div>

        <div style={{ height: 1, background: '#1c1c30' }} />

        {/* History */}
        <div style={{ padding: '12px 16px 4px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 3, color: '#64748b', textTransform: 'uppercase' }}>Historial</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {history.map((h, i) => (
            <div key={i} onClick={() => {
              setArch(h.arch);
              currentArchRef.current = h.arch;
              setCodeHtml(syntaxHL(h.arch.codeSnippet || ''));
              startAnimation(h.arch);
              setConcept(h.concept);
            }} style={{
              padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${i === 0 ? '#6d28d9' : 'transparent'}`,
              background: i === 0 ? 'rgba(109,40,217,.35)' : 'transparent',
              marginBottom: 4, transition: 'all .2s',
            }}
              onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.borderColor = '#1c1c30'; e.currentTarget.style.background = '#141425'; }}}
              onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.concept}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: '#64748b', marginTop: 2 }}>{h.time} · {h.arch.modules?.length || 0} módulos</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div style={{ position: 'relative', background: '#08080f', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'default' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        />

        {/* Empty state */}
        {!arch && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 48, opacity: 0.12 }}>◈</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', opacity: 0.6 }}>Arquitectura 3D en espera</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#64748b', opacity: 0.4, textAlign: 'center', lineHeight: 1.8 }}>
              Ingresa un concepto y presiona<br />⚡ GENERAR ARQUITECTURA
            </div>
          </div>
        )}

        {/* Badge */}
        {arch && (
          <div style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(15,15,28,.95)', border: '1px solid #1c1c30',
            borderRadius: 8, padding: '8px 12px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{arch.appName}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#64748b', marginTop: 2, maxWidth: 240, lineHeight: 1.5 }}>{arch.description}</div>
          </div>
        )}

        {/* Controls */}
        <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 6 }}>
          {[['⊡', resetView], ['+', zoomIn], ['−', zoomOut]].map(([icon, fn]) => (
            <button key={icon} onClick={fn} style={{
              width: 32, height: 32, borderRadius: 6,
              border: '1px solid #1c1c30', background: '#0f0f1c',
              color: '#64748b', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c30'; e.currentTarget.style.color = '#64748b'; }}
            >{icon}</button>
          ))}
        </div>
      </div>

      {/* ── OUTPUT PANEL ── */}
      <div style={{ background: '#0f0f1c', borderLeft: '1px solid #1c1c30', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1c1c30', padding: '0 8px' }}>
          {['code','modules','specs'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px', fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
              cursor: 'pointer', textTransform: 'capitalize',
              borderBottom: `2px solid ${activeTab === tab ? '#8b5cf6' : 'transparent'}`,
              color: activeTab === tab ? '#8b5cf6' : '#64748b',
              marginBottom: -1, transition: 'all .2s',
            }}>
              {tab === 'code' ? 'Código' : tab === 'modules' ? 'Módulos' : 'Specs'}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {/* Code tab */}
          {activeTab === 'code' && (
            <>
              <pre style={{
                padding: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                lineHeight: 1.75, color: '#abb2bf', whiteSpace: 'pre', overflowX: 'auto',
                minHeight: 200,
              }} dangerouslySetInnerHTML={{ __html: codeHtml || '<span style="color:#5c6370;font-style:italic">// La arquitectura generada aparecerá aquí</span>' }} />
              <button onClick={copyCode} style={{
                width: 'calc(100% - 24px)', margin: '0 12px 12px',
                padding: 8, borderRadius: 6, border: '1px solid #1c1c30',
                background: 'transparent', color: '#64748b',
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                cursor: 'pointer', letterSpacing: 1, transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c30'; e.currentTarget.style.color = '#64748b'; }}
              >
                {copied ? '[ ✓ COPIADO ]' : '[ COPIAR CÓDIGO ]'}
              </button>
            </>
          )}

          {/* Modules tab */}
          {activeTab === 'modules' && (
            <div style={{ padding: 8 }}>
              {(arch?.modules || []).map(m => (
                <div key={m.id} style={{
                  padding: '10px 12px', borderRadius: 8,
                  border: '1px solid #1c1c30', marginBottom: 6, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = m.color || '#6d28d9'; e.currentTarget.style.background = '#141425'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c30'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: m.color || '#6d28d9' }} />
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: m.color || '#e2e8f0', paddingLeft: 8 }}>{m.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: '#64748b', marginTop: 2, paddingLeft: 8 }}>{(m.type||'MODULE').toUpperCase()} · {m.id}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 5, lineHeight: 1.5, paddingLeft: 8 }}>{m.description}</div>
                </div>
              ))}
              {!arch && <div style={{ padding: 24, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#64748b' }}>Genera una arquitectura primero</div>}
            </div>
          )}

          {/* Specs tab */}
          {activeTab === 'specs' && (
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {arch ? (
                <>
                  {[
                    { title: 'Render Pipeline', rows: [['Pipeline', arch.specs?.renderPipeline], ['FPS Est.', arch.specs?.estimatedFPS], ['Hardware', arch.specs?.targetHardware]] },
                    { title: 'Escena 3D', rows: [['Complejidad', arch.specs?.sceneComplexity], ['Draw Calls', arch.specs?.drawCalls], ['Polígonos', arch.specs?.polygonCount], ['Módulos', `${arch.modules?.length || 0} nodos`]] },
                  ].map(block => (
                    <div key={block.title} style={{ background: '#141425', borderRadius: 8, padding: 12, border: '1px solid #1c1c30' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 2, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>{block.title}</div>
                      {block.rows.map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '4px 0', borderBottom: '1px solid #1c1c30' }}>
                          <span style={{ color: '#64748b' }}>{k}</span>
                          <span style={{ color: '#06b6d4', fontWeight: 500 }}>{v || '—'}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{ background: '#141425', borderRadius: 8, padding: 12, border: '1px solid #1c1c30' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: 2, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Stack Tecnológico</div>
                    <div>{(arch.techStack || []).map(t => (
                      <span key={t} style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, border: '1px solid #1c1c30', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: '#8b5cf6', margin: 2, background: 'rgba(109,40,217,.35)' }}>{t}</span>
                    ))}</div>
                  </div>
                </>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#64748b' }}>Genera una arquitectura para ver las specs</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes axis-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1c1c30;border-radius:2px}
      `}</style>
    </div>
  );
}
