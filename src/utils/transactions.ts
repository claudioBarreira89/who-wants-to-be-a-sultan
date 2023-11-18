import { Wallet, providers, Contract, constants, utils } from "ethers";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { WalletClient, useWalletClient } from "wagmi";
import React from "react";

export const getSigner = (privateKey: string, providerArg?: any) => {
  return new Wallet(privateKey, providerArg || provider);
};

export const provider = new providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_PROVIDER_URL
);

export const signer = getSigner(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!);

export const setTokenAllowance = async (
  tokenAddress: string,
  address: string
) => {
  try {
    const allowance = await getTokenAllowance(
      tokenAddress,
      address,
      process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!
    );

    if (allowance !== "0.0") {
      return;
    }

    const signer = provider.getSigner();

    const erc20 = new Contract(tokenAddress, ERC20.abi, signer);

    const tx = await erc20.approve(
      process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!,
      constants.MaxUint256
    );

    await tx.wait();
  } catch (error) {
    console.error("Error setting token allowance:", error);
    throw error;
  }
};

export const getTokenAllowance = async (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
) => {
  try {
    const erc20 = new Contract(tokenAddress, ERC20.abi, provider);

    const allowance = await erc20.allowance(ownerAddress, spenderAddress);
    return utils.formatUnits(allowance, 18);
  } catch (error) {
    console.error("Error fetching token allowance:", error);
    throw error;
  }
};

// Signer
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
