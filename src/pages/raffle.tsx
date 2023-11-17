import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

const raffle = () => {
  return (
    <>
      <Head>
        <title>Raffle - Who wants to be a sultan?</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <p>Raffle</p>
      </Layout>
    </>
  )
}

export default raffle