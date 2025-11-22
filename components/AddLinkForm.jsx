'use client';
import { useState } from 'react';

export default function AddLinkForm({ onCreated }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function validateUrl(u) {
    try {
      const parsed = new URL(u);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateUrl(targetUrl)) {
      setError('Please enter a valid http(s) URL');
      return;
    }
    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      setError('Custom code must match [A-Za-z0-9]{6,8}');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_url: targetUrl, code: customCode || undefined }),
      });
      if (res.status === 201) {
        const data = await res.json();
        setSuccess('Created: ' + data.code);
        setTargetUrl('');
        setCustomCode('');
        onCreated && onCreated(data);
      } else if (res.status === 409) {
        setError('Code already exists. Choose another.');
      } else {
        const txt = await res.text();
        setError('Error: ' + txt);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
      <div className="mb-3">
        <label className="block text-sm font-medium">Target URL</label>
        <input
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="https://example.com/path"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Custom code (optional)</label>
        <input
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="6-8 chars alphanumeric"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          type="submit"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </div>
    </form>
  );
}
