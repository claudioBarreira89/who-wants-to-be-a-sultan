import type { NextApiRequest, NextApiResponse } from "next";
import { Contract } from "ethers";
import sultanRaffleAbi from "../../abi/sultan-raffle.json";
import { signer } from "@/utils/transactions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const raffleContract = new Contract(
      process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!,
      sultanRaffleAbi,
      signer
    );

    const tx = await raffleContract.closePool();

    console.log({ tx });

    res.status(200).json({ data: "pool closed" });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
