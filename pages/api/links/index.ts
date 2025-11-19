import prisma from '../../../prisma/client';
import { isValidUrl, isValidCode } from '../../../lib/validate';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler for /api/links
 * GET: Returns all links, sorted by newest first
 * POST: Creates a new short link (with optional custom code or auto-generated)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: Fetch all links
  if (req.method === 'GET') {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(links);
  }

  // POST: Create a new link
  if (req.method === 'POST') {
    const { target, code } = req.body;

    // Validate target URL
    if (!target || !isValidUrl(target)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let finalCode = code;

    // If custom code provided, validate it
    if (finalCode) {
      if (!isValidCode(finalCode)) {
        return res.status(400).json({ error: 'Bad code' });
      }
      // Check if code already exists
      const existingLink = await prisma.link.findUnique({
        where: { code: finalCode },
      });
      if (existingLink) {
        return res.status(409).json({ error: 'Exists' });
      }
    } else {
      // Auto-generate a random code (6 characters)
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let isUnique = false;

      while (!isUnique) {
        finalCode = Array.from({ length: 6 })
          .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
          .join('');

        const existing = await prisma.link.findUnique({
          where: { code: finalCode },
        });
        isUnique = !existing;
      }
    }

    // Create the link
    const newLink = await prisma.link.create({
      data: { code: finalCode, target },
    });

    return res.status(201).json(newLink);
  }

  // Method not allowed
  res.status(405).end();
}
