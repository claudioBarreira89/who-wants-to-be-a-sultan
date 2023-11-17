import React, { ReactNode, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi';
import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode; }) => {
  const { chain } = useNetwork();
  const chainId = chain?.id || "";
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] = useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const isChainSupported = useMemo(() => [137, 5, 1].find(chain => chain === chainId), [chainId]);

  return (
    <>
      <header className="flex justify-between items-center p-4 pb-7">
        <div className='flex justify-between w-full'>
          {/* <div className={`absolute top-0 left-0 right-0 bottom-0 bg-[hsla(0,0%,4%,0.75)] transition-opacity duration-200 ${isConnectHighlighted || isNetworkSwitchHighlighted ? 'opacity-100' : 'opacity-0'}`} /> */}
          <div>
            <Link href="/">
              <Image src="./sultan.svg" alt="sultans logo" width={20} height={20} className="h-auto w-20" />
            </Link>
          </div>
          <div className='flex gap-6'>
            <ul className="flex gap-2 items-center">
              <li><Link className="" href="/">Home</Link></li>
              <li><Link className="" href="/raffle">Raffle</Link></li>
            </ul>
            <div className="flex items-center gap-2">
              <div
                onClick={closeAll}
                className={`relative ${isNetworkSwitchHighlighted ? 'z-5' : ''}`}
              >
                <w3m-network-button />
              </div>
              <div
                onClick={closeAll}
                className={`relative ${isConnectHighlighted ? 'z-5' : ''}`}
              >
                <w3m-button />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="grid place-items-center h-full">
        {children}
      </main>
    </>
  )

}

export default Layout