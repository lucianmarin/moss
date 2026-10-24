import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const STREAM_URL = 'https://streamssleu.chilltrax.com/stream?sid=1';
const CHILLTRAX_INFO_URL = 'https://www.chilltrax.com/php/GetSongInformationNew.php';
const CHILLTRAX_COVER_URL = 'https://www.chilltrax.com/php/GetCoverImageNew.php';

async function readIcyStreamTitle() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const res = await fetch(STREAM_URL, {
      headers: { 'Icy-MetaData': '1' },
      signal: controller.signal
    });
    const metaint = Number(res.headers.get('icy-metaint'));
    if (!metaint || !res.body) return null;

    const reader = res.body.getReader();
    let buf = Buffer.alloc(0);
    while (buf.length < metaint + 512) {
      const { value, done } = await reader.read();
      if (done) break;
      buf = Buffer.concat([buf, Buffer.from(value)]);
    }
    await reader.cancel().catch(() => {});

    if (buf.length <= metaint) return null;
    const metaLen = buf[metaint] * 16;
    if (metaLen <= 0) return null;
    const rawMeta = buf
      .subarray(metaint + 1, metaint + 1 + metaLen)
      .toString('utf8')
      .replace(/\0+$/g, '');
    const match = rawMeta.match(/StreamTitle='([^']*)'/i);
    if (!match || !match[1]) return null;
    const streamTitle = match[1].trim();
    const parts = streamTitle.split(' - ');
    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(' - ').trim(),
        streamTitle
      };
    }
    return { artist: 'Chilltrax', title: streamTitle, streamTitle };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function chilltraxStreamMetadataPlugin() {
  const handler = async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/stream-meta')) {
      return next();
    }
    try {
      const [icyData, infoRes, coverRes] = await Promise.all([
        readIcyStreamTitle(),
        fetch(CHILLTRAX_INFO_URL).then((r) => r.json()).catch(() => null),
        fetch(CHILLTRAX_COVER_URL).then((r) => r.json()).catch(() => null)
      ]);

      const artist = icyData?.artist || infoRes?.artist || 'Chilltrax';
      const title = icyData?.title || infoRes?.title || 'Live Chillout Stream';
      const cover = coverRes?.cover || null;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(
        JSON.stringify({
          ok: true,
          artist,
          title,
          cover,
          label: infoRes?.label || null,
          year: infoRes?.year || null,
          streamTitle: icyData?.streamTitle || `${artist} - ${title}`
        })
      );
    } catch (err) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, error: String(err) }));
    }
  };

  return {
    name: 'chilltrax-stream-metadata',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), chilltraxStreamMetadataPlugin()],
  publicDir: 'public',
  server: {
    port: 5173,
    host: true
  }
});
