let framesCache = null;
let categoriesCache = null;

export async function loadFramesIndex() {
  if (framesCache) return { frames: framesCache, categories: categoriesCache };
  const res = await fetch('/qr-dinamico/frames/index.json');
  if (!res.ok) throw new Error('No se pudo cargar el catálogo de frames');
  const data = await res.json();
  framesCache = data.frames || [];
  categoriesCache = data.categories || [];
  return { frames: framesCache, categories: categoriesCache };
}

export function getFrameById(id, frames) {
  return frames.find(f => String(f.id) === String(id)) || null;
}

export function getFrameUrl(frame) {
  if (!frame) return null;
  return `/qr-dinamico/frames/${frame.file}`;
}

export function getDefaultFrameOptions() {
  return {
    qr_frame_style: 'none',
    qr_frame_text: 'Scan me',
    qr_frame_text_color: '#000000'
  };
}
