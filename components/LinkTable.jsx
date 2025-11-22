'use client';
import { useState } from 'react';
import clsx from 'clsx';

function formatDate(d) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d;
  }
}

export default function LinkTable({ initialLinks, onDeleted }) {
  const [links, setLinks] = useState(initialLinks || []);
  const [filter, setFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  function filtered() {
    if (!filter) return links;
    return links.filter(l => l.code.includes(filter) || l.target_url.includes(filter));
  }

  async function handleDelete(code) {
    if (!confirm('Delete ' + code + '?')) return;
    setDeleting(code);
    try {
      const res = await fetch('/api/links/' + code, { method: 'DELETE' });
      if (res.status === 204) {
        const updated = links.filter(l => l.code !== code);
        setLinks(updated);
        onDeleted && onDeleted(code);
      } else {
        alert('Delete failed');
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white shadow-sm rounded p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          placeholder="Search by code or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="p-2">Code</th>
              <th className="p-2">Target URL</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Last clicked</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered().map(link => (
              <tr key={link.code} className="border-t">
                <td className="p-2 align-top">
                  <a href={`/${link.code}`} className="font-mono text-blue-600">{link.code}</a>
                </td>
                <td className="p-2 align-top truncate-ellipsis max-w-[40ch]">{link.target_url}</td>
                <td className="p-2 align-top">{link.total_clicks}</td>
                <td className="p-2 align-top">{formatDate(link.last_clicked)}</td>
                <td className="p-2 align-top">
                  <a
                    href={`/code/${link.code}`}
                    className="inline-block px-2 py-1 mr-2 border rounded text-xs"
                  >
                    Stats
                  </a>
                  <button
                    onClick={() => handleDelete(link.code)}
                    disabled={deleting === link.code}
                    className={clsx('inline-block px-2 py-1 border rounded text-xs', deleting === link.code && 'opacity-60')}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered().length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No links found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
