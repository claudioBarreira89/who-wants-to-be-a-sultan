import type { NextApiRequest, NextApiResponse } from "next";
import { Contract } from "ethers";
import sultanRaffleAbi from "../../abi/sultan-raffle.json";
import { provider, signer } from "@/utils/transactions";

type Data = {
  charityAddress: string;
  tokenAddress: string;
  name: string;
  description: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { charityAddress, tokenAddress, name, description } = req.body;

    const raffleContract = new Contract(
      process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!,
      sultanRaffleAbi,
      signer
    );

    const tx = await raffleContract.initializePool(
      tokenAddress,
      charityAddress
    );

    console.log({ tx });

    res.status(200).json({ data: "pool initialized" });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
