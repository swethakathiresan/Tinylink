import { query } from '../../../lib/db';


function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const target_url = body.target_url;
    let code = body.code; // optional

    if (!target_url) return new Response('target_url is required', { status: 400 });

    // validate URL
    try {
      const u = new URL(target_url);
      if (!['http:', 'https:'].includes(u.protocol)) throw new Error('invalid protocol');
    } catch (e) {
      return new Response('Invalid target_url', { status: 400 });
    }

    if (code) {
      if (!isValidCode(code)) return new Response('Invalid code format', { status: 400 });
      // check exists
      const existing = await query('SELECT code FROM links WHERE code = ?', [code]);
      if (existing.rowCount > 0) return new Response(JSON.stringify({ message: 'Code exists' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    } else {
      // generate random 7-char code
      code = await generateUniqueCode();
    }

    await query('INSERT INTO links(code, target_url) VALUES(?, ?)', [code, target_url]);
    return new Response(JSON.stringify({ code, short_url: `${process.env.BASE_URL?.replace(/\/$/, '') || ''}/${code}` }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/links failed', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await query('SELECT code, target_url, total_clicks, last_clicked FROM links ORDER BY created_at DESC');
    return new Response(JSON.stringify(res.rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/links failed', err);
    return new Response('Internal server error', { status: 500 });
  }
}

async function generateUniqueCode() {
  const len = 7;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let attempt = 0; attempt < 6; attempt++) {
    let code = '';
    for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const exists = await query('SELECT 1 FROM links WHERE code = ?', [code]);
    if (exists.rowCount === 0) return code;
  }
  // fallback
  return Date.now().toString(36).slice(-7);
}
