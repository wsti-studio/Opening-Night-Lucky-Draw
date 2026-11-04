// Serves the site and keeps the winners list on the server, so it survives
// a reload, a browser change or a different laptop. No dependencies.
//
// Winners live in WINNERS_FILE (a Railway volume at /data in production).
// Reading or changing them needs DRAW_KEY, which the stage link carries as ?key=.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const KEY = process.env.DRAW_KEY || '';
const FILE = process.env.WINNERS_FILE || path.join(ROOT, 'data', 'winners.json');
const MAX_WINNERS = 5;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon' };
const PUBLIC = new Set(['index.html', 'config.js', 'festi-logo.svg']);

function readWinners() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')).winners || []; } catch (e) { return []; }
}
function writeWinners(winners) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ winners, savedAt: new Date().toISOString() }, null, 2));
  fs.renameSync(tmp, FILE);
}
// Keep only the fields the wheel uses, trimmed, and at most five winners.
function clean(list) {
  if (!Array.isArray(list)) return null;
  return list.slice(0, MAX_WINNERS).map((w) => ({
    name: String(w?.name ?? '').slice(0, 40),
    code: String(w?.code ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10),
    at: String(w?.at ?? '').slice(0, 40),
  })).filter((w) => w.name && w.code);
}
function keyOk(req) {
  const given = Buffer.from(String(req.headers['x-draw-key'] || ''));
  const want = Buffer.from(KEY);
  return KEY !== '' && given.length === want.length && crypto.timingSafeEqual(given, want);
}
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function api(req, res) {
  if (!keyOk(req)) return json(res, 403, { error: 'Wrong or missing key' });
  if (req.method === 'GET') return json(res, 200, { winners: readWinners() });
  if (req.method === 'DELETE') { writeWinners([]); return json(res, 200, { winners: [] }); }
  if (req.method === 'PUT') {
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 20000) return json(res, 413, { error: 'Too large' }); }
    let winners;
    try { winners = clean(JSON.parse(raw).winners); } catch (e) { winners = null; }
    if (!winners) return json(res, 400, { error: 'Expected { winners: [...] }' });
    writeWinners(winners);
    return json(res, 200, { winners });
  }
  res.writeHead(405, { Allow: 'GET, PUT, DELETE' }); res.end();
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/winners') return void api(req, res).catch(() => json(res, 500, { error: 'Server error' }));
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  const name = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  if (!PUBLIC.has(name)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  fs.readFile(path.join(ROOT, name), (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(PORT, () => console.log(`Lucky draw on port ${PORT}; winners file ${FILE}; key ${KEY ? 'set' : 'NOT set'}`));
