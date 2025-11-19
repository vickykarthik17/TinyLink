// pages/code/[code].tsx
import React from 'react';
import Layout from '../../components/Layout';
import prisma from '../../prisma/client';

type LinkData = {
  code: string;
  target: string;
  clicks: number;
  lastClicked?: string | null;
  createdAt: string;
};

type Props = {
  data: LinkData | null;
};

export default function Stats({ data }: Props) {
  if (!data) {
    return (
      <Layout>
        <div className="text-center p-6">Not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">Stats for {data.code}</h2>
        <p className="mt-3">
          Target:{' '}
          <a className="underline text-blue-600" href={data.target} target="_blank" rel="noreferrer">
            {data.target}
          </a>
        </p>
        <p className="mt-2">Total clicks: <strong>{data.clicks}</strong></p>
        <p className="mt-1">Last clicked: {data.lastClicked ? new Date(data.lastClicked).toLocaleString() : 'Never'}</p>
        <p className="mt-1 text-sm text-slate-500">Created: {new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }: { params: { code: string } }) {
  const code = params.code;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return { props: { data: null } };
  }

  return {
    props: {
      data: {
        code: link.code,
        target: link.target,
        clicks: link.clicks,
        lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
        createdAt: link.createdAt.toISOString()
      }
    }
  };
}
