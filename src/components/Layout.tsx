import React, { ReactNode, useMemo, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  const { chain } = useNetwork();
  const chainId = chain?.id || "";
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const isChainSupported = useMemo(
    () => [137, 5, 1].find((chain) => chain === chainId),
    [chainId]
  );

  return (
    <>
      <header className="flex justify-between items-center p-4 pb-7">
        <div className="flex justify-between w-full">
          {/* <div className={`absolute top-0 left-0 right-0 bottom-0 bg-[hsla(0,0%,4%,0.75)] transition-opacity duration-200 ${isConnectHighlighted || isNetworkSwitchHighlighted ? 'opacity-100' : 'opacity-0'}`} /> */}
          <div>
            <Link href="/">
              <Image
                src="./sultan.svg"
                alt="sultans logo"
                width={20}
                height={20}
                className="h-auto w-20"
              />
            </Link>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div
                onClick={closeAll}
                className={`relative ${isNetworkSwitchHighlighted ? "z-5" : ""
                  }`}
              >
                <w3m-network-button />
              </div>
              <div
                onClick={closeAll}
                className={`relative ${isConnectHighlighted ? "z-5" : ""}`}
              >
                <w3m-button />
              </div>
            </div>
          </div>
        </div>
      </header>
      {address ?
        <main className="grid place-items-center h-full">
          <div className="max-w-[850px]">
            {children}
          </div>
        </main> :
        <main className="grid place-items-center h-full">
          <div className="flex justify-center items-center flex-col gap-4 rounded-3xl mt-8 p-8 bg-cardBg w-[550px]">
            <h2>Please log-in with your wallet to use the app</h2>
          </div>
        </main>}
    </>
  );
};

export default Layout;
