import React, { useState } from 'react';
import { isValidCode, isValidUrl } from '../lib/validate';

type Props = {
  onCreated: () => Promise<void>;
};

/**
 * Form for creating new short links
 * Users can provide a target URL and optional custom code
 */
export default function LinkForm({ onCreated }: Props) {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    // Validate target URL
    if (!isValidUrl(target)) {
      setMessage('Invalid URL. Please enter a valid HTTP/HTTPS URL.');
      return;
    }

    // Validate custom code if provided
    if (code && !isValidCode(code)) {
      setMessage('Invalid code. Must be 6-8 alphanumeric characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          code: code || undefined, // Omit code if empty for auto-generation
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        // Success: Clear form and refresh parent
        setTarget('');
        setCode('');
        setMessage('✓ Link created successfully!');
        await onCreated();
      } else {
        // Error from API
        setMessage(data.error || 'Failed to create link');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Error creating link:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow rounded-lg border border-gray-200 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Create a New Short Link</h2>

      <div className="flex flex-col gap-4">
        {/* Target URL Input */}
        <div>
          <label htmlFor="target" className="block text-sm font-medium mb-1">
            Target URL
          </label>
          <input
            id="target"
            type="url"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        {/* Custom Code Input (Optional) */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Custom Code (Optional)
          </label>
          <input
            id="code"
            type="text"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Leave blank for auto-generated code"
          />
          <p className="text-xs text-gray-500 mt-1">6-8 alphanumeric characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            message.includes('✓')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
