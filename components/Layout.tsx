import React from 'react';
import Link from 'next/link';

type Props = {
  children: React.ReactNode;
};

/**
 * Main layout component for all pages
 * Provides header, main content area, and footer
 */
export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">TinyLink</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
