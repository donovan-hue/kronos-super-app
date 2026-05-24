# ScriptDrop ⚡
Generador de scripts virales para TikTok y Reels con IA.

## Stack
React + Vite · Supabase (auth + DB + Edge Functions) · Anthropic API · Vercel

## Setup local
```bash
git clone https://github.com/donovan-hue/scriptdrop.git
cd scriptdrop
npm install
```
Crea `.env.local`:
```
VITE_SUPABASE_URL=https://akvrbjhixggzynydlzwp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_IPz-0nEi3ZS_7QfQl23gsg_gEX34Awb
```
```bash
npm run dev
```

## Planes
| | Gratis | Pro | Agencia |
|---|---|---|---|
| Precio | $0 | $9.99/mes | $24.99/mes |
| Scripts/día | 3 | ∞ | ∞ |
| Modos | Script+Hook+Hashtags | +Bio+Ideas | Todo |
| Historial | 5 | 30 días | Ilimitado |
| Exportar TXT | ❌ | ✅ | ✅ |
| Cuentas | 1 | 1 | 5 |

## Estado de fases
- [x] Fase 1 — Definición del producto
- [x] Fase 2 — Setup técnico + estructura
- [x] Fase 3 — Auth + Supabase + tablas
- [x] Fase 4 — Generador IA (5 modos)
- [x] Fase 5 — Edge Function (API key segura)
- [ ] Fase 6 — Stripe (pagos)
- [ ] Fase 7 — Deploy Vercel
