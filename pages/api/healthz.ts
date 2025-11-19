import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Simple health check endpoint
 * Returns OK if the server is running
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ ok: true, version: '1.0' });
}