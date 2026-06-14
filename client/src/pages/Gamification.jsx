import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GlassCard, Icon } from '../components/kronos';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RARITY_COLOR = {
  common:    { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', text: '#6b7280', label: 'Común'    },
  rare:      { bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.4)', text: '#3b82f6',  label: 'Raro'     },
  epic:      { bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.4)', text: '#8B5CF6',  label: 'Épico'    },
  legendary: { bg: 'rgba(236,72,153,0.1)',   border: 'rgba(236,72,153,0.5)', text: '#EC4899',  label: 'Legendario'},
};

const LEVEL_TITLES = [
  [1,'Novato'],[5,'Aprendiz'],[10,'Explorador'],[15,'Aventurero'],[20,'Veterano'],
  [25,'Experto'],[30,'Maestro'],[35,'Élite'],[40,'Campeón'],[45,'Leyenda'],[50,'Kronos Legend'],
];
function getLevelTitle(level) {
  let title = 'Novato';
  for (const [l, t] of LEVEL_TITLES) { if (level >= l) title = t; }
  return title;
}

/* ── Barra de progreso XP ── */
function XPBar({ progress, xpForNext }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(201,206,212,0.45)', marginBottom: 6 }}>
        <span>Progreso al siguiente nivel</span>
        <span>{progress}% · faltan {xpForNext.toLocaleString()} XP</span>
      </div>
      <div style={{ height: 10, background: 'rgba(190,200,212,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg,#EC4899,#8B5CF6,#06B6D4)',
          width: `${Math.min(progress, 100)}%`,
          transition: 'width 1s ease',
          boxShadow: '0 0 8px rgba(139,92,246,0.5)',
        }} />
      </div>
    </div>
  );
}

/* ── Tarjeta de badge ── */
function BadgeCard({ badge, earned }) {
  const r = RARITY_COLOR[badge.rarity] || RARITY_COLOR.common;
  return (
    <div style={{
      background: earned ? r.bg : 'rgba(10,10,20,0.03)',
      border: `1.5px solid ${earned ? r.border : 'rgba(255,255,255,0.05)'}`,
      borderRadius: 16, padding: '14px 12px', textAlign: 'center',
      opacity: earned ? 1 : 0.45,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { if (earned) { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${r.border}`; } }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
    >
      {earned && (
        <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: r.text, boxShadow: `0 0 6px ${r.text}` }} />
      )}
      <div style={{ fontSize: 32, marginBottom: 6, display: 'flex', justifyContent: 'center', minHeight: 32, alignItems: 'center' }}>{earned ? badge.emoji : <Icon name="lock" size={28} />}</div>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#c9ced4', marginBottom: 2 }}>{badge.name}</div>
      <div style={{ fontSize: 10, color: r.text, fontWeight: 600, marginBottom: 4 }}>{r.label}</div>
      <div style={{ fontSize: 10, color: 'rgba(201,206,212,0.45)', lineHeight: 1.4 }}>{badge.description}</div>
      {earned && <div style={{ fontSize: 10, color: r.text, fontWeight: 700, marginTop: 4 }}>+{badge.xpReward} XP</div>}
    </div>
  );
}

/* ── Página principal ── */
export default function Gamification() {
  const { user } = useContext(AuthContext);
  const [stats, setStats]         = useState(null);
  const [badges, setBadges]       = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('stats'); // stats | badges | leaderboard
  const [rarityFilter, setRarityFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/gamification`),
      axios.get(`${API}/gamification/badges`),
    ]).then(([statsRes, badgesRes]) => {
      setStats(statsRes.data);
      setBadges(badgesRes.data.badges || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'leaderboard' && !leaderboard.length) {
      axios.get(`${API}/gamification/leaderboard`)
        .then(r => setLeaderboard(r.data.leaderboard || []))
        .catch(() => {});
    }
  }, [tab]); // eslint-disable-line

  const filteredBadges = rarityFilter === 'all' ? badges : badges.filter(b => b.rarity === rarityFilter);
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#c9ced4', display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="trophy" size={24} /> Gamificación</h1>
          <div style={{ color: 'rgba(201,206,212,0.45)', fontSize: 13 }}>XP · Niveles · Badges · Leaderboard</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(190,200,212,0.04)', borderRadius: 14, padding: 4 }}>
          {[
            { id: 'stats',       icon: 'bolt',   label: 'Mi Perfil' },
            { id: 'badges',      icon: 'star',   label: 'Badges' },
            { id: 'leaderboard', icon: 'trophy', label: 'Top 50' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)' : 'transparent',
              color: tab === t.id ? '#fff' : 'rgba(201,206,212,0.55)',
              transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}><Icon name={t.icon} size={14} /> {t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'rgba(201,206,212,0.35)' }}>Cargando...</div>
        ) : tab === 'stats' && stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Card principal nivel */}
            <GlassCard style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(236,72,153,0.15),rgba(139,92,246,0.1))',
                filter: 'blur(30px)',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, position: 'relative' }}>
                {/* Círculo de nivel */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#EC4899,#8B5CF6,#06B6D4)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(139,92,246,0.4)',
                }}>
                  <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, opacity: 0.85 }}>NIVEL</div>
                  <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{stats.level}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: '#c9ced4' }}>{getLevelTitle(stats.level)}</div>
                  <div style={{ color: 'rgba(201,206,212,0.50)', fontSize: 13 }}>{stats.xp.toLocaleString()} XP total</div>
                  <div style={{ color: 'rgba(201,206,212,0.40)', fontSize: 12, marginTop: 2 }}>
                    {earnedCount}/{badges.length} badges desbloqueados
                  </div>
                </div>
              </div>
              <XPBar progress={stats.progress} xpForNext={stats.xpForNext} />
            </GlassCard>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'XP Total', value: stats.totalXpEarned?.toLocaleString(), icon: 'bolt' },
                { label: 'Badges',   value: `${earnedCount}/${badges.length}`,      icon: 'star' },
                { label: 'Nivel',    value: stats.level,                             icon: 'trending' },
              ].map(s => (
                <GlassCard key={s.label} style={{ padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}><Icon name={s.icon} size={24} /></div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: '#c9ced4' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(201,206,212,0.45)' }}>{s.label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Badges recientes */}
            {stats.badges?.length > 0 && (
              <GlassCard style={{ padding: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#c9ced4', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="star" size={14} /> Últimos badges</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {stats.badges.slice(-6).map(b => (
                    <div key={b.id} style={{
                      background: RARITY_COLOR[b.rarity]?.bg || 'rgba(190,200,212,0.06)',
                      border: `1px solid ${RARITY_COLOR[b.rarity]?.border || 'rgba(190,200,212,0.15)'}`,
                      borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 18 }}>{b.emoji}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#c9ced4' }}>{b.name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTab('badges')} style={{
                  marginTop: 12, background: 'none', border: 'none', color: '#8B5CF6',
                  cursor: 'pointer', fontWeight: 700, fontSize: 13,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>Ver todos los badges <Icon name="arrowRight" size={13} stroke="currentColor" /></button>
              </GlassCard>
            )}

            {/* Rachas */}
            <GlassCard style={{ padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#c9ced4', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="flame" size={14} /> Rachas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Login diario', key: 'login',   icon: 'calendar' },
                  { label: 'Publicando',   key: 'posting', icon: 'image' },
                  { label: 'Fitness',      key: 'health',  icon: 'heart' },
                ].map(s => (
                  <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#c9ced4', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name={s.icon} size={13} /> {s.label}</span>
                    <span style={{
                      fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4,
                      color: (stats.streaks?.[s.key]?.count || 0) > 0 ? '#f97316' : 'rgba(201,206,212,0.30)',
                    }}>
                      {stats.streaks?.[s.key]?.count || 0} días <Icon name="flame" size={13} stroke="currentColor" />
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

        ) : tab === 'badges' ? (
          <div>
            {/* Filtro de rareza */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['all','common','rare','epic','legendary'].map(r => (
                <button key={r} onClick={() => setRarityFilter(r)} style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: rarityFilter === r ? 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)' : 'rgba(190,200,212,0.06)',
                  color: rarityFilter === r ? '#fff' : 'rgba(201,206,212,0.60)',
                  transition: 'all 0.2s',
                }}>
                  {r === 'all' ? 'Todos' : RARITY_COLOR[r]?.label || r}
                  {r !== 'all' && ` (${badges.filter(b => b.rarity === r && b.earned).length}/${badges.filter(b => b.rarity === r).length})`}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {filteredBadges.map(b => <BadgeCard key={b.id} badge={b} earned={b.earned} />)}
            </div>
          </div>

        ) : (
          /* Leaderboard */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'rgba(201,206,212,0.35)' }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Icon name="trophy" size={40} /></div>
                <div>El leaderboard se está llenando...</div>
              </div>
            ) : leaderboard.map((entry, i) => {
              const medalColor = i === 0 ? '#facc15' : i === 1 ? '#cbd5e1' : '#d08b5b';
              const rankIcon = i < 3 ? <Icon name="trophy" size={24} stroke={medalColor} /> : `#${entry.rank}`;
              const isMe = entry.user?._id === (user?._id || user?.id);
              return (
                <GlassCard key={entry.user?._id || i} style={{
                  padding: '12px 16px',
                  border: isMe ? '1.5px solid rgba(139,92,246,0.5)' : undefined,
                  background: isMe ? 'rgba(139,92,246,0.04)' : undefined,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, minWidth: 36, textAlign: 'center', color: i < 3 ? undefined : 'rgba(201,206,212,0.40)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{rankIcon}</div>
                    <img src={entry.user?.avatar || `https://ui-avatars.com/api/?name=${entry.user?.username}&background=random`}
                      alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#c9ced4' }}>
                        {entry.user?.firstName || entry.user?.username}
                        {entry.user?.isVerified && <Icon name="check" size={12} style={{ verticalAlign: 'middle', marginLeft: 4 }} />}
                        {isMe && <span style={{ marginLeft: 6, fontSize: 11, color: '#8B5CF6', fontWeight: 700 }}>(tú)</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(201,206,212,0.45)' }}>
                        Nivel {entry.level} · {entry.badgeCount} badges
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: 15, background: 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {entry.xp.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(201,206,212,0.40)' }}>XP</div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>    </div>
  );
}
