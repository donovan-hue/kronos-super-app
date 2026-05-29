/**
 * Vercel Feature Flags — KRONOS
 *
 * El SDK `flags` requiere server-side runtime (Next.js/SvelteKit).
 * Para Create React App se consume el endpoint REST que Vercel expone
 * automáticamente cuando FLAGS y FLAGS_SECRET están configurados.
 *
 * El flag `mi-primera-k` fue creado en el dashboard de Vercel Flags
 * para el proyecto doonovaanga-2744s-projects/kronos-super-app.
 */

const FLAGS_ENDPOINT = '/.well-known/vercel/flags';

async function fetchFlags() {
  try {
    const res = await fetch(FLAGS_ENDPOINT);
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Flag: mi-primera-k
 * @returns {Promise<boolean>}
 */
export async function getMiPrimeraK() {
  const data = await fetchFlags();
  return data?.definitions?.['mi-primera-k']?.defaultValue ?? false;
}
