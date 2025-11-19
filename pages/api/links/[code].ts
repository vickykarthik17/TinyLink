import prisma from '../../../prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler for /api/links/:code
 * GET: Returns link details (code, target, clicks, lastClicked)
 * DELETE: Removes a link from the database
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  // Find the link in database
  const link = await prisma.link.findUnique({
    where: { code },
  });

  // GET: Return link details
  if (req.method === 'GET') {
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    return res.json(link);
  }

  // DELETE: Remove a link
  if (req.method === 'DELETE') {
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    await prisma.link.delete({
      where: { code },
    });
    return res.json({ ok: true });
  }

  // Method not allowed
  res.status(405).end();
}
