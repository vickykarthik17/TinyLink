import React from 'react';

type LinkItem = {
  id: string;
  code: string;
  target: string;
  clicks: number;
  lastClicked?: string | null;
};

type Props = {
  links: LinkItem[];
  loading: boolean;
  onDeleted?: () => Promise<void> | void;
};

const formatDateIST = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return '—';
  }
};

export default function LinkTable({ links = [], loading, onDeleted }: Props) {
  if (loading) return <div>Loading...</div>;
  if (!links.length) return <div>No links</div>;
  return (
    <table className="w-full bg-white shadow border-collapse">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="px-4 py-2 text-left font-semibold">Code</th>
          <th className="px-4 py-2 text-left font-semibold">Target</th>
          <th className="px-4 py-2 text-left font-semibold">Clicks</th>
          <th className="px-4 py-2 text-left font-semibold">Last</th>
          <th className="px-4 py-2 text-left font-semibold">Action</th>
        </tr>
      </thead>
      <tbody>
        {links.map((l) => (
          <tr key={l.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">
              <a href={`/${l.code}`} className="text-blue-600 hover:underline">{l.code}</a>
            </td>
            <td className="px-4 py-2 break-words max-w-xs">{l.target}</td>
            <td className="px-4 py-2 text-center">{l.clicks}</td>
            <td className="px-4 py-2 text-sm text-gray-600">{formatDateIST(l.lastClicked)}</td>
            <td className="px-4 py-2">
              <button
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                onClick={async () => {
                  await fetch(`/api/links/${l.code}`, { method: 'DELETE' });
                  if (onDeleted) await onDeleted();
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
