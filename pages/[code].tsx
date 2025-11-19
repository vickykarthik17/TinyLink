import prisma from '../prisma/client';
import type { GetServerSideProps } from 'next';

/**
 * This page handles short URL redirects.
 * When a user visits /:code, this function:
 * 1. Looks up the link in the database
 * 2. Increments the click counter
 * 3. Records the last click time
 * 4. Redirects to the target URL
 */
export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const code = params?.code as string;

  // Find the link in database
  const link = await prisma.link.findUnique({
    where: { code },
  });

  // If link not found, return 404
  if (!link) {
    return { notFound: true };
  }

  // Update click count and last clicked timestamp
  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Redirect to target URL
  res.writeHead(302, { Location: link.target });
  res.end();

  return { props: {} };
};

// This component renders nothing (redirect happens in getServerSideProps)
export default function RedirectPage() {
  return null;
}
