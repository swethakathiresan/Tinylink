import { query } from '../../lib/db';

export async function GET(req, { params }) {
  const { code } = params;
  try {
    const res = await query('SELECT target_url FROM links WHERE code = ?', [code]);
    if (res.rowCount === 0) return new Response('Not found', { status: 404 });
    const target = res.rows[0].target_url;
    // update counters (do not await to keep redirect snappy)
    query('UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = ?', [code]).catch(e => console.error(e));
    return new Response(null, { status: 302, headers: { Location: target } });
  } catch (err) {
    console.error('GET /:code failed', err);
    return new Response('Internal server error', { status: 500 });
  }
}
