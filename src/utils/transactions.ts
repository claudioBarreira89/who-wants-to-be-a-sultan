import { Wallet, providers } from "ethers";

export const getSigner = (privateKey: string, providerArg?: any) => {
  return new Wallet(privateKey, providerArg || provider);
};

export const provider = new providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_PROVIDER_URL
);

export const signer = getSigner(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!);
