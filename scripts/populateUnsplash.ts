import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

type UnsplashPhoto = {
  urls: { regular?: string; small?: string };
  user?: { name?: string };
  links?: { html?: string };
};
type UnsplashSearch = { results?: UnsplashPhoto[] };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // NUNCA commitar em repo público
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY as string;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !UNSPLASH_ACCESS_KEY) {
  console.error('Faltam envs: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, UNSPLASH_ACCESS_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchUnsplash(query: string) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('orientation', 'squarish');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash ${res.status} ${res.statusText}`);
  const data: UnsplashSearch = (await res.json()) as UnsplashSearch;
  const photo = data.results?.[0];
  if (!photo) return null;

  const src = photo.urls.regular ?? photo.urls.small;
  if (!src) return null;
  const img = new URL(src);
  img.searchParams.set('auto', 'format');
  img.searchParams.set('q', '80');
  return img.toString();
}

async function run() {
  console.log('> Procurando produtos sem image_url...');
  const { data: products, error } = await sb
    .from('products')
    .select('id, name, category, image_url')
    .or('image_url.is.null,image_url.eq.')
    .limit(1000);
  if (error) throw error;
  if (!products || products.length === 0) {
    console.log('Nada a atualizar.');
    return;
  }

  let updated = 0;
  for (const p of products) {
    const q = [p.name, p.category].filter(Boolean).join(' ');
    try {
      let img: string | null = null;
      if (q) img = await searchUnsplash(q);
      if (!img && p.name) img = await searchUnsplash(p.name);
      if (!img && p.category) img = await searchUnsplash(p.category);
      if (!img) {
        console.log(`- Sem imagem: ${p.name || p.id}`);
        await sleep(1200);
        continue;
      }

      const { error: upErr } = await sb
        .from('products')
        .update({ image_url: img })
        .eq('id', p.id);
      if (upErr) {
        console.warn(`! Falha ao atualizar ${p.id}: ${upErr.message}`);
      } else {
        updated++;
        console.log(`✓ ${p.name || p.id} <- ${img}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`! Erro em ${p.name || p.id}: ${msg}`);
    }
    await sleep(1200); // respeitar rate-limit
  }
  console.log(`Concluído. Atualizados: ${updated}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
