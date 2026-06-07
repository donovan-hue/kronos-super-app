import { useState } from "react";
import "../styles/kronospace.css";

/* ============================================================
   KRONOSPACE · Showcase de pantallas (estética metálica)
   Plata sobre negro · Space Grotesk + Manrope · iconos url(#ksV)
   ============================================================ */

const screens = [
  "splash", "login", "register", "feed", "search", "notifications",
  "chat", "communities", "communityDetail", "shop", "marketplace", "wallet",
  "live", "health", "avatar", "videoEditor", "events", "gamification",
  "reservations", "settings", "profile", "admin",
];

const screenNames = {
  splash: "Splash", login: "Login", register: "Registro", feed: "Feed Social",
  search: "Búsqueda", notifications: "Notificaciones", chat: "Chat",
  communities: "Comunidades", communityDetail: "Comunidad", shop: "Tienda",
  marketplace: "Marketplace", wallet: "Wallet", live: "Live", health: "Health",
  avatar: "Avatar", videoEditor: "Video Editor", events: "Eventos",
  gamification: "Gamificación", reservations: "Reservaciones", settings: "Ajustes",
  profile: "Perfil", admin: "Admin",
};

/* ---------- gradientes metálicos compartidos ---------- */
function KronosDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="ksV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="16%" stopColor="#e9edf1" />
          <stop offset="44%" stopColor="#a4aab1" /><stop offset="51%" stopColor="#74787f" />
          <stop offset="58%" stopColor="#bcc1c8" /><stop offset="84%" stopColor="#eef0f3" />
          <stop offset="100%" stopColor="#c9ced4" />
        </linearGradient>
        <linearGradient id="ksDiag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdfefe" /><stop offset="30%" stopColor="#c2c7ce" />
          <stop offset="50%" stopColor="#7a7e85" /><stop offset="70%" stopColor="#c8cdd3" />
          <stop offset="100%" stopColor="#f2f4f6" />
        </linearGradient>
        <radialGradient id="ksSph" cx="34%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="40%" stopColor="#c4c9cf" />
          <stop offset="100%" stopColor="#46494f" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ---------- iconos de línea ---------- */
const ICONS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  bell: <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-1.6 2h15.2Z" /><path d="M9.8 19.6a2.4 2.4 0 0 0 4.4 0" /></>,
  message: <><path d="M20 6.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h1.4v3l3.6-3H18a2 2 0 0 0 2-2Z" /><path d="M8 9.3h8M8 12.4h5" /></>,
  home: <><path d="M3.5 11.4 12 4l8.5 7.4" /><path d="M5.6 9.8V20h12.8V9.8" /><path d="M9.8 20v-5.2h4.4V20" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0" /></>,
  plus: <><rect x="4.5" y="4.5" width="15" height="15" rx="3.2" /><path d="M12 8.7v6.6M8.7 12h6.6" /></>,
  game: <><path d="M7.5 8h9a3.8 3.8 0 0 1 3.8 4.1l-.4 3.3a2.4 2.4 0 0 1-4.3 1.1L14.4 15H9.6l-1.2 1.5a2.4 2.4 0 0 1-4.3-1.1l-.4-3.3A3.8 3.8 0 0 1 7.5 8Z" /><path d="M7 10.6v2.2M5.9 11.7h2.2" /><circle cx="15.4" cy="11.4" r=".7" /><circle cx="17" cy="13" r=".7" /></>,
  cart: <><path d="M3.2 4.5H5.4L7.3 15h9.1l1.7-7.4H6.1" /><circle cx="9" cy="18.6" r="1.3" /><circle cx="16" cy="18.6" r="1.3" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6Z" /><path d="M9.2 12l2 2 3.6-4" /></>,
  heart: <path d="M12 20s-7-4.3-7-9.4A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.6C19 15.7 12 20 12 20Z" />,
  star: <path d="M12 4l2.3 4.8 5.2.5-3.9 3.5 1.1 5.1L12 18.8 7.3 21.4l1.1-5.1-3.9-3.5 5.2-.5Z" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2.2M12 18.3v2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6" /></>,
  wallet: <><rect x="3.5" y="6" width="17" height="12.5" rx="3" /><path d="M3.5 9.5h17" /><circle cx="16.5" cy="13.5" r="1.1" /></>,
  play: <><circle cx="12" cy="12" r="8.5" /><path d="M10.3 9l5 3-5 3Z" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="3" /><path d="M4 9.5h16M8.5 3.5v3.4M15.5 3.5v3.4" /></>,
  pulse: <path d="M3.5 12.5h3.6l1.8-4.4 3.2 9 2-4.6h6" />,
  video: <><rect x="3.5" y="6.5" width="12" height="11" rx="3" /><path d="M15.5 10.2l5-2.8v9.2l-5-2.8Z" /></>,
  users: <><circle cx="9" cy="9.2" r="3" /><path d="M3.6 19a5.4 5.4 0 0 1 10.8 0" /><path d="M15.8 6.6a3 3 0 0 1 0 5.7M17 19a5.4 5.4 0 0 0-1.7-3.9" /></>,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.2v5.2l3.3 1.9" /></>,
  back: <path d="M14.5 5.5l-6.5 6.5 6.5 6.5" />,
  trophy: <><path d="M7 5h10v3.2a5 5 0 0 1-10 0Z" /><path d="M7 6.2H4.6v1.4A2.8 2.8 0 0 0 7 10.2M17 6.2h2.4v1.4A2.8 2.8 0 0 1 17 10.2" /><path d="M9.5 14.2h5M8.8 18.3h6.4M12 14.2v4.1" /></>,
  bolt: <path d="M13 3l-7 10h5l-1 8 7-10.5h-5Z" />,
  flame: <path d="M12 3.5c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.6.6-2.4 1.4-3.2.3 1 .9 1.6 1.6 1.8-.4-2.4 0-5 1-6.4Z" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  send: <path d="M5 12l15-7-6 15-3-6Z" />,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M4.5 17l5-4.5 4 3 3-2.5 3.5 3" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  chevR: <path d="M9.5 5.5l6 6.5-6 6.5" />,
  ticket: <><path d="M4 7.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" /><path d="M14 5.5v8" /></>,
};
function Icon({ n }) {
  return <svg className="ks-ico" viewBox="0 0 24 24">{ICONS[n]}</svg>;
}

/* ---------- logo (concepto "órbita crono") ---------- */
function Mark({ className = "ks-mark" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" style={{ width: className ? undefined : 38, height: className ? undefined : 38 }}>
      <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="url(#ksV)" strokeWidth="1.6" transform="rotate(-26 50 50)" opacity=".8" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="url(#ksV)" strokeWidth="2.6" />
      <circle cx="50" cy="50" r="30.5" fill="none" stroke="url(#ksV)" strokeWidth="4.2" strokeDasharray="1.5 14.46" />
      <line x1="50" y1="50" x2="50" y2="24" stroke="url(#ksV)" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="58" stroke="url(#ksV)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="86" cy="38" r="5.4" fill="url(#ksSph)" /><circle cx="50" cy="50" r="3.8" fill="url(#ksSph)" />
    </svg>
  );
}
function Wordmark({ style }) {
  return <span className="wm metal-text" style={style}><span className="k">KRONO</span><span className="s">SPACE</span></span>;
}

/* ---------- primitivas ---------- */
const Bar = ({ w = "100%", tall, style }) => <div className={"ph-bar" + (tall ? " tall" : "")} style={{ width: w, ...style }} />;
const Av = ({ size = 40 }) => <div className="avatar" style={{ width: size, height: size }}><Icon n="user" /></div>;
const Amt = ({ size = 28 }) => <span className="ph-amt" style={{ fontSize: size, fontWeight: 600 }}>$ —</span>;

function ScreenHead({ title, icon = "bell" }) {
  return (
    <div className="scrn-h">
      <div className="ks-h scrn-title metal-text">{title}</div>
      <div className="iconbtn" style={{ width: 32, height: 32 }}><Icon n={icon} /></div>
    </div>
  );
}
function Chips({ items, active = 0 }) {
  return (
    <div className="row" style={{ gap: 7, marginBottom: 12, overflow: "hidden" }}>
      {items.map((c, i) => <div key={i} className={"chip" + (i === active ? " on" : "")}>{c}</div>)}
    </div>
  );
}
function TabBar({ active = 0 }) {
  const tabs = ["home", "search", "plus", "bell", "user"];
  return (
    <div className="tabbar">
      {tabs.map((t, i) => i === 2 ? (
        <div key={t} className="tab center"><div className="inner"><Icon n={t} /></div></div>
      ) : (
        <div key={t} className={"tab" + (i === active ? " on" : "")}><Icon n={t} /></div>
      ))}
    </div>
  );
}

/* ============================================================
   PANTALLAS
   ============================================================ */
function SplashScreen() {
  return (
    <div className="scrn" style={{ alignItems: "center", justifyContent: "center", gap: 26 }}>
      <Mark className="ks-mark" />
      <Wordmark style={{ fontSize: 30 }} />
      <div className="ks-tag">Time × Space Platform</div>
      <div style={{ width: 140, marginTop: 8 }}><Bar w="40%" /></div>
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="scrn" style={{ justifyContent: "center", gap: 14 }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <Mark className="ks-mark" />
        <div className="ks-h metal-text" style={{ fontSize: 22, marginTop: 10 }}>Bienvenido</div>
        <div className="ks-tag" style={{ marginTop: 4 }}>Inicia sesión</div>
      </div>
      <div className="field"><Icon n="user" /><Bar w="55%" /></div>
      <div className="field"><Icon n="shield" /><Bar w="40%" /></div>
      <button className="btn-metal" style={{ marginTop: 6 }}>ENTRAR</button>
      <div className="row" style={{ gap: 8 }}>
        {["Google", "Apple", "GitHub"].map((p) => <button key={p} className="btn-ghost" style={{ flex: 1, padding: "9px 0", fontSize: 11 }}><span>{p}</span></button>)}
      </div>
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--ks-faint)" }}>¿Sin cuenta? <span className="metal-text" style={{ fontWeight: 600 }}>Regístrate</span></div>
    </div>
  );
}

function RegisterScreen() {
  return (
    <div className="scrn" style={{ justifyContent: "center", gap: 12 }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div className="ks-h metal-text" style={{ fontSize: 22 }}>Crear cuenta</div>
        <div className="ks-tag" style={{ marginTop: 4 }}>Únete a KRONOSPACE</div>
      </div>
      {["user", "message", "shield", "check"].map((ic, i) => (
        <div className="field" key={i}><Icon n={ic} /><Bar w={`${60 - i * 6}%`} /></div>
      ))}
      <button className="btn-metal" style={{ marginTop: 6 }}>REGISTRARME</button>
      <div style={{ textAlign: "center", marginTop: 6, fontSize: 12, color: "var(--ks-faint)" }}>¿Ya tienes cuenta? <span className="metal-text" style={{ fontWeight: 600 }}>Inicia sesión</span></div>
    </div>
  );
}

function FeedScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Feed" />
      <div className="row" style={{ gap: 12, marginBottom: 12, overflow: "hidden" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div className="avatar" style={{ width: 50, height: 50, border: "2px solid", borderColor: "var(--ks-line-strong)" }}><Icon n="user" /></div>
          </div>
        ))}
      </div>
      <div className="col" style={{ gap: 12, overflow: "hidden" }}>
        {[0, 1].map((i) => (
          <div className="card" key={i} style={{ padding: 12 }}>
            <div className="row" style={{ marginBottom: 10 }}><Av size={36} /><div className="col" style={{ gap: 5 }}><Bar w={90} /><Bar w={60} /></div></div>
            <div className="ph-block" style={{ height: 120, marginBottom: 10, display: "grid", placeItems: "center" }}><Icon n="image" /></div>
            <div className="row between"><div className="row" style={{ gap: 14 }}><Icon n="heart" /><Icon n="message" /><Icon n="send" /></div><Icon n="star" /></div>
          </div>
        ))}
      </div>
      <TabBar active={0} />
    </div>
  );
}

function SearchScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Buscar" icon="filter" />
      <div className="field" style={{ marginBottom: 12 }}><Icon n="search" /><span style={{ color: "var(--ks-faint)", fontSize: 12 }}>Personas, comunidades, tiendas…</span></div>
      <Chips items={["Todo", "Personas", "Comunidades", "Tienda"]} />
      <div className="ks-tag" style={{ marginBottom: 8 }}>Resultados</div>
      <div className="col">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="list-item" key={i}><Av size={42} /><div className="col" style={{ gap: 6 }}><Bar w={120} /><Bar w={70} /></div></div>
        ))}
      </div>
    </div>
  );
}

function NotificationsScreen() {
  const kinds = ["heart", "user", "message", "star", "cart", "trophy"];
  return (
    <div className="scrn">
      <ScreenHead title="Notificaciones" icon="check" />
      <div className="col">
        {kinds.map((k, i) => (
          <div className="list-item" key={i}>
            <div className="iconbtn" style={{ width: 38, height: 38, flexShrink: 0 }}><Icon n={k} /></div>
            <div className="col" style={{ gap: 6, flex: 1 }}><Bar w="80%" /><Bar w="45%" /></div>
            {i < 2 && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ks-silver)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatScreen() {
  return (
    <div className="scrn">
      <div className="row between" style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--ks-line)" }}>
        <div className="row"><Icon n="back" /><Av size={36} /><div className="col" style={{ gap: 5 }}><Bar w={80} /><Bar w={50} /></div></div>
        <Icon n="video" />
      </div>
      <div className="col" style={{ gap: 10, flex: 1 }}>
        {[["l", 120], ["r", 90], ["l", 70], ["r", 140], ["l", 100]].map(([side, w], i) => (
          <div key={i} style={{ alignSelf: side === "r" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
            <div className="ph-block" style={{ padding: "12px 14px", background: side === "r" ? "var(--ks-panel-2)" : undefined }}><Bar w={w} /></div>
          </div>
        ))}
      </div>
      <div className="field" style={{ marginTop: 10 }}><Icon n="image" /><Bar w="40%" /><div style={{ marginLeft: "auto" }}><Icon n="send" /></div></div>
    </div>
  );
}

function CommunitiesScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Comunidades" icon="plus" />
      <Chips items={["Para ti", "Tech", "Arte", "Gaming"]} />
      <div className="col" style={{ gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div className="card" key={i} style={{ overflow: "hidden" }}>
            <div className="ph-block" style={{ height: 64, borderRadius: 0, border: "none" }} />
            <div style={{ padding: 12 }}>
              <div className="row between">
                <div className="row"><Av size={40} /><div className="col" style={{ gap: 6 }}><Bar w={110} /><Bar w={70} /></div></div>
                <button className="btn-metal" style={{ padding: "7px 14px", fontSize: 11 }}>Unirme</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityDetailScreen() {
  return (
    <div className="scrn" style={{ padding: 0 }}>
      <div className="ph-block" style={{ height: 96, borderRadius: 0, border: "none", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: 14 }}><Icon n="back" /></div>
      </div>
      <div style={{ padding: "0 16px 14px", marginTop: -24 }}>
        <div className="avatar" style={{ width: 64, height: 64, border: "3px solid #060708" }}><Icon n="users" /></div>
        <div className="ks-h metal-text" style={{ fontSize: 20, marginTop: 10 }}>Comunidad</div>
        <Bar w={140} style={{ marginTop: 8 }} />
        <div className="row" style={{ gap: 20, margin: "14px 0" }}>
          {["Miembros", "Posts", "Eventos"].map((s) => (
            <div className="col" key={s} style={{ gap: 5 }}><span className="stat-num metal-text">—</span><span style={{ fontSize: 10, color: "var(--ks-faint)" }}>{s}</span></div>
          ))}
        </div>
        <Chips items={["Posts", "Miembros", "Acerca"]} />
        <div className="col" style={{ gap: 10 }}>
          {[0, 1].map((i) => <div className="card" key={i} style={{ padding: 12 }}><div className="row" style={{ marginBottom: 8 }}><Av size={32} /><Bar w={80} /></div><Bar w="90%" style={{ marginBottom: 6 }} /><Bar w="60%" /></div>)}
        </div>
      </div>
    </div>
  );
}

function ShopScreen() {
  return (
    <div className="scrn">
      <div className="scrn-h"><div className="ks-h scrn-title metal-text">Tienda</div><div className="row" style={{ gap: 8 }}><div className="iconbtn" style={{ width: 32, height: 32 }}><Icon n="search" /></div><div className="iconbtn badge" style={{ width: 32, height: 32 }}><Icon n="cart" /></div></div></div>
      <Chips items={["Todo", "Ropa", "Tech", "Arte"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div className="card" key={i} style={{ overflow: "hidden" }}>
            <div className="ph-block" style={{ height: 86, borderRadius: 0, border: "none", display: "grid", placeItems: "center" }}><Icon n="image" /></div>
            <div style={{ padding: 10 }}>
              <Bar w="80%" style={{ marginBottom: 8 }} />
              <div className="row between"><Amt size={16} /><div className="iconbtn" style={{ width: 28, height: 28 }}><Icon n="plus" /></div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Marketplace" icon="plus" />
      <div className="field" style={{ marginBottom: 12 }}><Icon n="search" /><span style={{ color: "var(--ks-faint)", fontSize: 12 }}>Busca productos…</span></div>
      <div className="col" style={{ gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div className="card" key={i} style={{ padding: 10, display: "flex", gap: 12 }}>
            <div className="ph-block" style={{ width: 74, height: 74, display: "grid", placeItems: "center" }}><Icon n="image" /></div>
            <div className="col" style={{ gap: 7, flex: 1, justifyContent: "center" }}>
              <Bar w="70%" /><Bar w="40%" />
              <div className="row between" style={{ marginTop: 4 }}><Amt size={17} /><div className="row" style={{ gap: 4 }}><Icon n="star" /><Bar w={26} /></div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Wallet" icon="clock" />
      <div className="card" style={{ padding: 18, background: "var(--ks-panel-2)", marginBottom: 14 }}>
        <div className="ks-tag" style={{ marginBottom: 8 }}>Balance total</div>
        <Amt size={34} />
        <div className="row" style={{ gap: 8, marginTop: 16 }}>
          <button className="btn-metal" style={{ flex: 1, padding: "10px 0", fontSize: 11 }}>Enviar</button>
          <button className="btn-ghost" style={{ flex: 1, padding: "10px 0", fontSize: 11 }}><span>Recibir</span></button>
          <button className="btn-ghost" style={{ flex: 1, padding: "10px 0", fontSize: 11 }}><span>Recargar</span></button>
        </div>
      </div>
      <div className="ks-tag" style={{ marginBottom: 6 }}>Movimientos</div>
      <div className="col">
        {[0, 1, 2, 3].map((i) => (
          <div className="list-item" key={i}><div className="iconbtn" style={{ width: 36, height: 36 }}><Icon n={i % 2 ? "cart" : "bolt"} /></div><div className="col" style={{ gap: 6, flex: 1 }}><Bar w="60%" /><Bar w="35%" /></div><Amt size={14} /></div>
        ))}
      </div>
    </div>
  );
}

function LiveScreen() {
  return (
    <div className="scrn" style={{ padding: 0 }}>
      <div className="ph-block" style={{ flex: 1, borderRadius: 0, border: "none", position: "relative", display: "grid", placeItems: "center" }}>
        <div className="orb home" style={{ position: "relative", left: 0, top: 0, transform: "none", width: 60, height: 60 }}><span className="face"><Icon n="play" /></span></div>
        <div style={{ position: "absolute", top: 14, left: 14 }} className="row">
          <span className="chip on" style={{ padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#15171a" }} />LIVE</span>
          <span className="chip" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon n="user" /> —</span>
        </div>
      </div>
      <div style={{ padding: 14 }} className="col">
        <div className="col" style={{ gap: 8, marginBottom: 10 }}>
          {[0, 1, 2].map((i) => <div className="row" key={i}><Av size={26} /><Bar w={`${70 - i * 12}%`} /></div>)}
        </div>
        <div className="field"><Icon n="message" /><Bar w="40%" /><div style={{ marginLeft: "auto" }}><Icon n="heart" /></div></div>
      </div>
    </div>
  );
}

function HealthScreen() {
  const cards = [["pulse", "Ritmo"], ["bolt", "Pasos"], ["clock", "Sueño"], ["heart", "Calorías"]];
  return (
    <div className="scrn">
      <ScreenHead title="Health" icon="gear" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {cards.map(([ic, lb], i) => (
          <div className="card" key={i} style={{ padding: 14 }}>
            <Icon n={ic} />
            <div className="stat-num metal-text" style={{ fontSize: 22, marginTop: 8 }}>—</div>
            <div style={{ fontSize: 10, color: "var(--ks-faint)", letterSpacing: ".1em" }}>{lb}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 14 }}>
        <div className="ks-tag" style={{ marginBottom: 10 }}>Actividad semanal</div>
        <div className="row" style={{ alignItems: "flex-end", gap: 8, height: 70 }}>
          {[40, 70, 30, 90, 55, 75, 50].map((h, i) => <div key={i} className="ph-bar" style={{ width: "100%", height: `${h}%`, borderRadius: 4 }} />)}
        </div>
      </div>
    </div>
  );
}

function AvatarScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Avatar" icon="check" />
      <div style={{ display: "grid", placeItems: "center", margin: "10px 0 18px" }}>
        <div className="avatar" style={{ width: 130, height: 130, background: "radial-gradient(circle at 34% 30%, #ffffff, #c4c9cf 40%, #46494f 100%)", boxShadow: "0 24px 50px -20px rgba(0,0,0,.9)" }} />
      </div>
      <div className="col" style={{ gap: 10 }}>
        {["Rostro", "Cabello", "Atuendo", "Accesorios"].map((lb, i) => (
          <div className="card" key={i} style={{ padding: "12px 14px" }} >
            <div className="row between"><div className="row"><Icon n="user" /><span style={{ fontSize: 13, color: "var(--ks-dim)" }}>{lb}</span></div><Icon n="chevR" /></div>
          </div>
        ))}
      </div>
      <button className="btn-metal" style={{ marginTop: 14 }}>GUARDAR AVATAR</button>
    </div>
  );
}

function VideoEditorScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Editor" icon="check" />
      <div className="ph-block" style={{ height: 150, marginBottom: 12, display: "grid", placeItems: "center" }}><Icon n="play" /></div>
      <div className="card" style={{ padding: 10, marginBottom: 12 }}>
        <div className="row" style={{ gap: 4, height: 38 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="ph-block" style={{ flex: 1, height: "100%" }} />)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[["filter", "Filtros"], ["bolt", "IA FX"], ["message", "Texto"], ["star", "Efectos"], ["clock", "Velocidad"], ["image", "Media"]].map(([ic, lb], i) => (
          <div className="card" key={i} style={{ padding: "12px 6px", display: "grid", placeItems: "center", gap: 6 }}><Icon n={ic} /><span style={{ fontSize: 10, color: "var(--ks-faint)" }}>{lb}</span></div>
        ))}
      </div>
    </div>
  );
}

function EventsScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Eventos" icon="calendar" />
      <Chips items={["Todos", "Hoy", "Semana", "Online"]} />
      <div className="col" style={{ gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div className="card" key={i} style={{ padding: 12, display: "flex", gap: 12 }}>
            <div className="ph-block" style={{ width: 54, height: 54, display: "grid", placeItems: "center" }}><Icon n="calendar" /></div>
            <div className="col" style={{ gap: 7, flex: 1, justifyContent: "center" }}>
              <Bar w="75%" />
              <div className="row" style={{ gap: 6 }}><Icon n="clock" /><Bar w={70} /></div>
            </div>
            <div className="col" style={{ justifyContent: "center" }}><div className="iconbtn" style={{ width: 30, height: 30 }}><Icon n="ticket" /></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamificationScreen() {
  const badges = ["star", "bolt", "heart", "shield", "flame", "trophy"];
  return (
    <div className="scrn">
      <ScreenHead title="Logros" icon="trophy" />
      <div className="card" style={{ padding: 16, background: "var(--ks-panel-2)", marginBottom: 14 }}>
        <div className="row between" style={{ marginBottom: 10 }}><div className="row"><Icon n="trophy" /><span className="ks-h metal-text" style={{ fontSize: 16 }}>Nivel —</span></div><Bar w={50} /></div>
        <div className="ph-block" style={{ height: 10, padding: 0 }}><div className="ph-bar" style={{ width: "55%", height: "100%", borderRadius: 12 }} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {badges.map((b, i) => (
          <div className="col" key={i} style={{ alignItems: "center", gap: 7 }}>
            <div className="avatar" style={{ width: 58, height: 58, opacity: i < 4 ? 1 : 0.4 }}><Icon n={b} /></div>
            <Bar w={40} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationsScreen() {
  return (
    <div className="scrn">
      <ScreenHead title="Reservas" icon="calendar" />
      <Chips items={["Próximas", "Pasadas", "Canceladas"]} />
      <div className="col" style={{ gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div className="card" key={i} style={{ padding: 12 }}>
            <div className="row between" style={{ marginBottom: 10 }}><div className="row"><div className="iconbtn" style={{ width: 34, height: 34 }}><Icon n="calendar" /></div><div className="col" style={{ gap: 6 }}><Bar w={100} /><Bar w={64} /></div></div><span className="chip on" style={{ padding: "4px 10px" }}>Activa</span></div>
            <div className="row" style={{ gap: 6 }}><Icon n="clock" /><Bar w={120} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const groups = [
    ["Cuenta", ["user", "shield", "bell"]],
    ["Preferencias", ["gear", "image", "bolt"]],
    ["Soporte", ["message", "check"]],
  ];
  return (
    <div className="scrn">
      <ScreenHead title="Ajustes" icon="search" />
      <div className="row" style={{ marginBottom: 16, gap: 12 }}><Av size={52} /><div className="col" style={{ gap: 7 }}><Bar w={120} /><Bar w={80} /></div></div>
      <div className="col" style={{ gap: 14 }}>
        {groups.map(([g, items], i) => (
          <div key={i}>
            <div className="ks-tag" style={{ marginBottom: 8 }}>{g}</div>
            <div className="card">
              {items.map((ic, j) => (
                <div key={j} className="row between" style={{ padding: "12px 14px", borderBottom: j < items.length - 1 ? "1px solid var(--ks-line)" : "none" }}>
                  <div className="row"><Icon n={ic} /><Bar w={90} /></div><Icon n="chevR" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="scrn" style={{ padding: 0 }}>
      <div className="ph-block" style={{ height: 100, borderRadius: 0, border: "none", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, right: 14 }}><Icon n="gear" /></div>
      </div>
      <div style={{ padding: "0 16px 14px", marginTop: -28 }}>
        <div className="avatar" style={{ width: 72, height: 72, border: "3px solid #060708" }}><Icon n="user" /></div>
        <div className="ks-h metal-text" style={{ fontSize: 21, marginTop: 10 }}>Tu Nombre</div>
        <Bar w={120} style={{ marginTop: 8 }} />
        <div className="row" style={{ gap: 24, margin: "16px 0" }}>
          {["Posts", "Seguidores", "Siguiendo"].map((s) => (
            <div className="col" key={s} style={{ gap: 5 }}><span className="stat-num metal-text" style={{ fontSize: 18 }}>—</span><span style={{ fontSize: 10, color: "var(--ks-faint)" }}>{s}</span></div>
          ))}
        </div>
        <div className="row" style={{ gap: 8, marginBottom: 16 }}>
          <button className="btn-metal" style={{ flex: 1, padding: "10px 0", fontSize: 12 }}>Editar perfil</button>
          <button className="btn-ghost" style={{ padding: "10px 14px" }}><span>···</span></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div className="ph-block" key={i} style={{ aspectRatio: "1", display: "grid", placeItems: "center" }}><Icon n="image" /></div>)}
        </div>
      </div>
    </div>
  );
}

function AdminScreen() {
  return (
    <div className="scrn">
      <div className="scrn-h"><div className="row"><Mark className="" /><div className="ks-h scrn-title metal-text">Admin</div></div><Av size={32} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["users", "Usuarios"], ["cart", "Órdenes"], ["wallet", "Ingresos"], ["bolt", "Activos"]].map(([ic, lb], i) => (
          <div className="card" key={i} style={{ padding: 12 }}>
            <div className="row between"><Icon n={ic} /><Bar w={28} /></div>
            <div className="stat-num metal-text" style={{ fontSize: 20, marginTop: 8 }}>—</div>
            <div style={{ fontSize: 10, color: "var(--ks-faint)" }}>{lb}</div>
          </div>
        ))}
      </div>
      <Chips items={["Resumen", "Usuarios", "Contenido", "Reportes"]} />
      <div className="card">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="row between" style={{ padding: "11px 14px", borderBottom: i < 3 ? "1px solid var(--ks-line)" : "none" }}>
            <div className="row"><Av size={28} /><Bar w={90} /></div><Bar w={40} /><Icon n="chevR" />
          </div>
        ))}
      </div>
    </div>
  );
}

const screenComponents = {
  splash: SplashScreen, login: LoginScreen, register: RegisterScreen, feed: FeedScreen,
  search: SearchScreen, notifications: NotificationsScreen, chat: ChatScreen,
  communities: CommunitiesScreen, communityDetail: CommunityDetailScreen, shop: ShopScreen,
  marketplace: MarketplaceScreen, wallet: WalletScreen, live: LiveScreen, health: HealthScreen,
  avatar: AvatarScreen, videoEditor: VideoEditorScreen, events: EventsScreen,
  gamification: GamificationScreen, reservations: ReservationsScreen, settings: SettingsScreen,
  profile: ProfileScreen, admin: AdminScreen,
};

/* ---------- marco de teléfono ---------- */
function Phone({ children, label }) {
  return (
    <div className="phone-cell">
      <div className="ks-phone">
        <div className="notch" />
        <div className="statusbar">
          <span className="sb-time metal-text">9:41</span>
          <span className="sb-icons">
            <svg viewBox="0 0 24 14"><path d="M1 11h2v2H1zM5 8h2v5H5zM9 5h2v8H9zM13 2h2v11h-2z" fill="url(#ksV)" /></svg>
            <svg viewBox="0 0 20 14"><path d="M10 3.5c2.4 0 4.6.9 6.2 2.4l1.4-1.5A11 11 0 0 0 10 1 11 11 0 0 0 2.4 4.4l1.4 1.5A9 9 0 0 1 10 3.5z" fill="url(#ksV)" /><path d="M10 7c1.3 0 2.5.5 3.4 1.4l1.4-1.5A7 7 0 0 0 10 5a7 7 0 0 0-4.8 1.9l1.4 1.5A5 5 0 0 1 10 7z" fill="url(#ksV)" /><circle cx="10" cy="11" r="1.6" fill="url(#ksV)" /></svg>
            <svg viewBox="0 0 28 14"><rect x="1" y="2.5" width="22" height="9" rx="2.5" fill="none" stroke="url(#ksV)" strokeWidth="1.2" /><rect x="3" y="4.5" width="16" height="5" rx="1" fill="url(#ksV)" /><rect x="24.5" y="5" width="2" height="4" rx="1" fill="url(#ksV)" /></svg>
          </span>
        </div>
        <div className="screen-body">{children}</div>
      </div>
      <div className="phone-label">{label}</div>
    </div>
  );
}

/* ---------- menú abanico interactivo ---------- */
const FAN = [
  ["perfil", "user", -90], ["mensaje", "message", -42], ["notifica", "bell", 6],
  ["game", "game", 54], ["market", "cart", 102], ["publica", "plus", 150],
];
function FanNav() {
  const [open, setOpen] = useState(true);
  const r = 132;
  return (
    <div className={"fan" + (open ? " open" : "")} style={{ width: 66, height: 66 }}>
      <div className="scrim" />
      {FAN.map(([key, ic, deg]) => {
        const a = (deg * Math.PI) / 180;
        return (
          <button className="orb sat" key={key} style={{ "--tx": `${(Math.cos(a) * r).toFixed(1)}px`, "--ty": `${(Math.sin(a) * r).toFixed(1)}px` }}>
            <span className="face"><Icon n={ic} /></span><span className="olabel">{key}</span>
          </button>
        );
      })}
      <button className="orb home" onClick={() => setOpen((o) => !o)}>
        <span className="face"><Icon n="home" /></span><span className="olabel home-label">Inicio</span>
      </button>
    </div>
  );
}

/* ---------- preview del shell web (escritorio) ---------- */
function WebShell() {
  return (
    <div className="webshell">
      <div className="topbar">
        <div className="brand"><div className="logo"><Mark className="" /></div><Wordmark /></div>
        <div className="searchbar"><Icon n="search" /><Bar w="50%" /></div>
        <div className="tb-actions">
          <div className="iconbtn"><Icon n="shield" /></div>
          <div className="iconbtn badge"><Icon n="bell" /></div>
          <div className="iconbtn"><Icon n="message" /></div>
          <div className="avatar av-40"><Icon n="user" /></div>
        </div>
      </div>
      <div className="stage"><FanNav /></div>
    </div>
  );
}

/* ============================================================
   PÁGINA
   ============================================================ */
export default function KronosMockups() {
  const [view, setView] = useState("grid");
  const [single, setSingle] = useState("splash");

  return (
    <div className="ks-root ks-bg ks-page">
      <KronosDefs />

      <div className="ks-hero">
        <div className="ks-lockup"><Mark className="ks-mark" /><Wordmark /></div>
        <div className="ks-rule" />
        <div className="ks-tag">Diseño de pantallas · plata sobre negro</div>
        <div className="ks-domain">krono-spase.com</div>
        <div className="ks-toggle">
          <button className={"chip" + (view === "grid" ? " on" : "")} onClick={() => setView("grid")}>Vista Grid</button>
          <button className={"chip" + (view === "single" ? " on" : "")} onClick={() => setView("single")}>Vista Individual</button>
          <button className={"chip" + (view === "web" ? " on" : "")} onClick={() => setView("web")}>Shell Web</button>
        </div>
      </div>

      {view === "web" && <div className="ks-shell-wrap"><WebShell /></div>}

      {view === "single" && (
        <div className="row" style={{ gap: 6, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto 24px" }}>
          {screens.map((s) => (
            <button key={s} className={"chip" + (single === s ? " on" : "")} onClick={() => setSingle(s)}>{screenNames[s]}</button>
          ))}
        </div>
      )}

      {view === "grid" && (
        <div className="ks-grid">
          {screens.map((s) => {
            const Comp = screenComponents[s];
            return <Phone key={s} label={screenNames[s]}><Comp /></Phone>;
          })}
        </div>
      )}

      {view === "single" && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Phone label={screenNames[single]}>{(() => { const C = screenComponents[single]; return <C />; })()}</Phone>
        </div>
      )}
    </div>
  );
}
