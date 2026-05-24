import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { mode, niche, topic, tone } = await req.json()
    const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')

    const prompts: Record<string, string> = {
      full: `Eres experto en contenido viral para TikTok. Genera un script completo de 45-55 segundos.
Nicho: ${niche} | Tema: ${topic} | Tono: ${tone}
Formato OBLIGATORIO:
[HOOK 0-3s]: Frase que detiene el scroll. Impactante.
[DESARROLLO 3-45s]: 4-5 puntos cortos, revelaciones, datos clave.
[CTA 45-55s]: Invita a seguir, comentar o compartir.
Solo el script en español, sin explicaciones.`,

      hook: `Eres experto en hooks virales para TikTok.
Genera 5 hooks diferentes. Nicho: ${niche} | Tema: ${topic} | Tono: ${tone}
Cada hook: máximo 3 segundos al leerlo. Que generen curiosidad o FOMO.
Formato: 1. hook  2. hook  etc. Solo en español.`,

      hashtags: `Genera 20 hashtags para TikTok.
Nicho: ${niche} | Tema: ${topic}
Mezcla: 5 muy populares (+10M), 10 medianos (1M-10M), 5 de nicho.
Solo los hashtags con #, separados por espacio.`,

      bio: `Eres experto en perfiles de TikTok e Instagram.
Genera 3 versiones de bio para creador de contenido.
Nicho: ${niche} | Tono: ${tone}
Cada bio: máximo 150 caracteres. Con emoji. Con CTA.
Formato: 1. bio  2. bio  3. bio. Solo en español.`,

      ideas: `Eres estratega de contenido para TikTok.
Genera 10 ideas de videos para todo el mes.
Nicho: ${niche} | Tono: ${tone}
Cada idea: título gancho + descripción corta de qué decir.
Formato: 1. TÍTULO — descripción. Solo en español.`,
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompts[mode] }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || 'Error al generar.'

    return new Response(JSON.stringify({ result: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
