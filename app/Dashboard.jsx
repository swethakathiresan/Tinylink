'use client';
import { useEffect, useState } from 'react';
import AddLinkForm from '../components/AddLinkForm';
import LinkTable from '../components/LinkTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all links from API
  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        setLinks(data);
      } catch (err) {
        console.error('Failed to fetch links', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  // Called after new link is created
  function handleLinkCreated(newLink) {
    setLinks(prev => [newLink, ...prev]);
  }

  // Called after a link is deleted
  function handleLinkDeleted(deletedCode) {
    setLinks(prev => prev.filter(link => link.code !== deletedCode));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Add Link Form */}
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold mb-3">Create a short link</h2>
          <AddLinkForm onCreated={handleLinkCreated} />
        </div>

        {/* Links Table */}
        <div className="md:flex-1">
          <h2 className="text-lg font-semibold mb-3">Links</h2>
          {loading ? (
            <div className="text-gray-500">Loading links...</div>
          ) : (
            <LinkTable initialLinks={links} onDeleted={handleLinkDeleted} />
          )}
        </div>
      </div>
    </div>
  );
}
