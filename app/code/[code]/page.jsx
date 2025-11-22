import { query } from '../../../lib/db';

export async function generateStaticParams() {
  // no-op: keep dynamic
  return [];
}

export default async function CodePage({ params }) {
  const { code } = params;
  const res = await query('SELECT code, target_url, total_clicks, last_clicked, created_at FROM links WHERE code = ?', [code]);
  if (res.rowCount === 0) {
    return (
      <div className="p-4 bg-white rounded shadow-sm">Not found</div>
    );
  }
  const link = res.rows[0];
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Stats for {link.code}</h2>
      <dl className="grid grid-cols-1 gap-2">
        <div>
          <dt className="font-medium">Target URL</dt>
          <dd><a href={link.target_url} className="text-blue-600">{link.target_url}</a></dd>
        </div>
        <div>
          <dt className="font-medium">Total clicks</dt>
          <dd>{link.total_clicks}</dd>
        </div>
        <div>
          <dt className="font-medium">Last clicked</dt>
          <dd>{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : '-'}</dd>
        </div>
        <div>
          <dt className="font-medium">Created at</dt>
          <dd>{new Date(link.created_at).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
