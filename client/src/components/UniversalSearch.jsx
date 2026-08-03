import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { GlassCard, HoloText, HashtagText, Icon } from './kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { value: 'all',      label: 'Todo',     icon: 'search' },
  { value: 'posts',    label: 'Posts',    icon: 'message' },
  { value: 'users',    label: 'Usuarios', icon: 'user' },
  { value: 'products', label: 'Ropa',     icon: 'bag' },
];

export default function UniversalSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const doSearch = useCallback(async (q, cat) => {
    if (!q.trim()) return;
    setLoading(true);
    setShowDrop(false);
    try {
      const { data } = await axios.get(`${API_URL}/search/global`, {
        params: { query: q, category: cat === 'all' ? undefined : cat }
      });
      setResults(data.results);
    } catch {}
    finally { setLoading(false); }
  }, []);

  // Trigger search when ?q= is set (e.g. from hashtag clicks)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q, 'all');
      inputRef.current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('q')]);

  // Suggestions debounce
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setShowDrop(false); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/search/suggestions`, { params: { query } });
        setSuggestions(data.suggestions || []);
        setShowDrop(true);
      } catch {}
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query });
    doSearch(query, category);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (query.trim()) doSearch(query, cat);
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setSuggestions([]);
    setSearchParams({});
  };

  const totalResults = results
    ? (results.users?.length || 0) + (results.posts?.length || 0) + (results.products?.length || 0)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: 100 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px' }}>
        <HoloText size={24} style={{ marginBottom: 16 }}>Buscar</HoloText>

        {/* Search bar */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><Icon name="search" size={16} /></span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Usuarios, posts, hashtags, ropa..."
                autoComplete="off"
                style={{ width: '100%', background: 'rgba(79,172,254,0.07)', border: '1px solid rgba(190,200,212,0.14)', borderRadius: 28, padding: '11px 40px 11px 42px', color: '#c9ced4', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              {query && (
                <button type="button" onClick={clearSearch}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(201,206,212,0.50)', cursor: 'pointer', lineHeight: 1, display: 'flex' }}>
                  <Icon name="close" size={16} stroke="currentColor" />
                </button>
              )}
            </div>
            <button type="submit"
              style={{ padding: '11px 20px', borderRadius: 28, background: 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)', color: '#15171a', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Buscar
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showDrop && suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--ink-2)', border: '1.5px solid var(--line-2)', borderRadius: 16, marginTop: 6, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {suggestions.map((s, i) => (
                <button key={i} type="button"
                  onClick={() => { setQuery(s.text); setShowDrop(false); doSearch(s.text, category); setSearchParams({ q: s.text }); }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', color: '#c9ced4', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, borderBottom: i < suggestions.length - 1 ? '1px solid rgba(190,200,212,0.06)' : 'none' }}>
                  <span style={{ display: 'flex' }}><Icon name={s.type === 'user' ? 'user' : s.type === 'product' ? 'bag' : 'search'} size={15} /></span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => handleCategoryChange(cat.value)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1.5px solid', borderColor: category === cat.value ? 'transparent' : 'var(--line-2)', cursor: 'pointer', background: category === cat.value ? 'linear-gradient(135deg,var(--accent),var(--accent-bright))' : 'var(--panel)', color: category === cat.value ? '#fff' : 'rgba(201,206,212,0.65)', transition: 'all 0.2s' }}>
              <span style={{ display: 'flex' }}><Icon name={cat.icon} size={14} stroke={category === cat.value ? '#fff' : 'url(#ksV)'} /></span><span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(201,206,212,0.50)' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon name="search" size={36} /></div>
            <div>Buscando...</div>
          </div>
        )}

        {/* No results */}
        {!loading && results && totalResults === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(201,206,212,0.35)' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon name="search" size={40} /></div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Sin resultados para "{query}"</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Intenta con otras palabras o hashtags</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon name="search" size={48} /></div>
            <div style={{ fontSize: 14 }}>Busca usuarios, posts, productos o #hashtags</div>
          </div>
        )}

        {/* Results */}
        {!loading && results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Posts */}
            {results.posts?.length > 0 && (category === 'all' || category === 'posts') && (
              <section>
                <div style={{ color: 'rgba(201,206,212,0.50)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  <Icon name="note" size={13} stroke="currentColor" style={{ verticalAlign: -2, marginRight: 5 }} />Posts ({results.posts.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.posts.map(post => (
                    <GlassCard key={post._id} style={{ padding: '12px 14px', cursor: 'pointer' }}
                      onClick={() => navigate(`/feed`)}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                        <img src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=random&color=fff&size=32`}
                          alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ color: '#c9ced4', fontSize: 13, fontWeight: 600 }}>{post.author?.firstName || post.author?.username}</div>
                          <div style={{ color: 'rgba(201,206,212,0.35)', fontSize: 11 }}>@{post.author?.username}</div>
                        </div>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.5 }}>
                        <HashtagText text={post.content} />
                      </div>
                      {post.image && (
                        <img src={post.image} alt="" style={{ width: '100%', borderRadius: 10, marginTop: 8, maxHeight: 200, objectFit: 'cover' }} />
                      )}
                      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 6 }}>
                        <Icon name="heart" size={11} stroke="currentColor" style={{ verticalAlign: -1, marginRight: 3 }} />{post.likes?.length || 0} · <Icon name="message" size={11} stroke="currentColor" style={{ verticalAlign: -1, margin: '0 3px 0 2px' }} />{post.comments?.length || 0}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            )}

            {/* Users */}
            {results.users?.length > 0 && (category === 'all' || category === 'users') && (
              <section>
                <div style={{ color: 'rgba(201,206,212,0.50)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  <Icon name="user" size={13} stroke="currentColor" style={{ verticalAlign: -2, marginRight: 5 }} />Usuarios ({results.users.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.users.map(u => (
                    <GlassCard key={u._id} style={{ padding: '12px 14px', cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${u._id}`)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=random&color=fff&size=44`}
                          alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#c9ced4', fontSize: 14, fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                          <div style={{ color: 'rgba(201,206,212,0.50)', fontSize: 12 }}>@{u.username}</div>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                          {u.followers?.length || 0} seguidores
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            {results.products?.length > 0 && (category === 'all' || category === 'products') && (
              <section>
                <div style={{ color: 'rgba(201,206,212,0.50)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  <Icon name="bag" size={13} stroke="currentColor" style={{ verticalAlign: -2, marginRight: 5 }} />Ropa ({results.products.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                  {results.products.map(p => (
                    <GlassCard key={p._id} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => navigate(`/shop/product/${p._id}`)}>
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                      )}
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ color: '#c9ced4', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ color: '#c9ced4', fontSize: 14, fontWeight: 800, marginTop: 2 }}>${p.price}</div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
