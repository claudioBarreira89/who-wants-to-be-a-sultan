import { Roboto } from 'next/font/google'
import { Button } from 'antd';
import React, { ReactNode, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import SectionTitle from './SectionTitle';
import useIsHydrated from '../hooks/useIsHydrated';
import { Head } from 'next/document';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

const Layout = ({ children }: { children: ReactNode; }) => {
  const { isDisconnected, address } = useAccount();
  const isHydrated = useIsHydrated();
  const { chain } = useNetwork();
  const chainId = chain?.id || "";
  const { open } = useWeb3Modal();
  const isChainSupported = useMemo(() => [137, 5, 1].find(chain => chain === chainId), [chainId])

  return (
    <main className={`bg-gray-100 flex min-h-screen flex-col items-center pb-20 ${roboto.className}`}>
      <Head>
        <title>WWTBAM affle</title>
        <meta name="description" content="who wants to be a sultan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full bg-white shadow-sm p-4 flex justify-between">
        <p className='uppercase text-4xl m-0 p-0 h-fit'>Gazton</p>
        <div className='flex gap-3'>
          <Button
            type="default"
            className='round'
            onClick={() => open()}>{isHydrated && isDisconnected ? "Connect Wallet" : "Switch Network"}
          </Button>
        </div>
      </div>

      <div className=' max-w-5xl min-w-5xl'>
        {(isHydrated && !isChainSupported) ? (
          <div className='w-[600px] bg-white shadow p-8 rounded-xl mt-10'>
            <SectionTitle>Please make sure you have your wallet connected and are on the supported chain to use this feature</SectionTitle>
          </div>)
          : children
        }
      </div>
    </main >
  )
}

export default Layout