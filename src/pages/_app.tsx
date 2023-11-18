import "../styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, sepolia } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const chains = [
  mainnet,
  polygon,
  avalanche,
  arbitrum,
  bsc,
  optimism,
  gnosis,
  fantom,
  sepolia,
];

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  const queryClient = new QueryClient();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={wagmiConfig}>
            <link rel="icon" href="/sultan.svg" sizes="any" />
            <Component {...pageProps} />
            <ToastContainer />
          </WagmiConfig>
        </QueryClientProvider>
      ) : null}
    </>
  );
}