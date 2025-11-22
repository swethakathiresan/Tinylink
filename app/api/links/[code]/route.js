import { query } from '../../../../lib/db';


export async function GET(req, { params }) {
  const { code } = params;
  try {
    const res = await query('SELECT code, target_url, total_clicks, last_clicked, created_at FROM links WHERE code = ?', [code]);
    if (res.rowCount === 0) return new Response('Not found', { status: 404 });
    return new Response(JSON.stringify(res.rows[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/links/:code failed', err);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { code } = params;
  try {
    const res = await query('DELETE FROM links WHERE code = ?', [code]);
    if (res.rowCount === 0) return new Response('Not found', { status: 404 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('DELETE /api/links/:code failed', err);
    return new Response('Internal server error', { status: 500 });
  }
}
