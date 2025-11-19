import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all links from the API
  async function loadLinks() {
    setLoading(true);
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoading(false);
    }
  }

  // Load links when component mounts
  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <Layout>
      <LinkForm onCreated={loadLinks} />
      <LinkTable links={links} loading={loading} onDeleted={loadLinks} />
    </Layout>
  );
}
