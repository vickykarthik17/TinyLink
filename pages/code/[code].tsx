import React from 'react'; import Layout from '../../components/Layout'; import prisma from '../../prisma/client';
export default function Stats({data}){ if(!data) return <Layout>Not found</Layout>;
  return <Layout><div>Code:{data.code}<br/>Clicks:{data.clicks}<br/>Target:{data.target}</div></Layout>;
}
export async function getServerSideProps({params}){ const l=await prisma.link.findUnique({where:{code:params.code}}); if(!l) return {props:{data:null}}; return {props:{data:{...l,lastClicked:l.lastClicked?l.lastClicked.toISOString():null}}};}
