import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { erc20ABI, useAccount, useContractWrite } from "wagmi";

import sultanRaffleAbi from "../abi/sultan-raffle.json";
import { getTokenAllowance } from "@/utils/transactions";
import { waitForTransaction, writeContract } from "wagmi/actions";

export default function AdminPanel() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { mutate: initPool } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/initPool", {
        tokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        charityAddress: "0x06d67c0F18a4B2055dF3C22201f351B131843970",
        name: "Charity pool",
        description: "Funds to help climate change",
      });
      return response;
    },
  });

  const { mutate: closePool } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/closePool");
      queryClient.invalidateQueries(["raffleInfo"]);

      return response;
    },
  });

  const {
    data,
    isLoading,
    isSuccess,
    write: betOnPool,
  } = useContractWrite({
    address: process.env
      .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
    abi: sultanRaffleAbi,
    functionName: "betOnPool",
  });

  // const { write: approveToken } = useContractWrite({
  //   address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" as `0x${string}`,
  //   abi: erc20ABI,
  //   functionName: "approve",
  // });

  const handleBet = async () => {
    try {
      const allowance = await getTokenAllowance(
        "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        address as `0x${string}`,
        process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!
      );

      console.log(allowance);

      if (allowance === "0.0") {
        const tx = await writeContract({
          address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
          functionName: "approve",
          abi: erc20ABI,
          args: [
            process.env
              .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
            BigInt(10 * 10 ** 18),
          ],
        });

        console.log("approved");

        await waitForTransaction({ hash: tx.hash });
      }

      if (betOnPool) betOnPool();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="m-2 p-2 border fixed bottom-0 rounded-md opacity-5 hover:opacity-80 transition-all">
      <div className="mb-1">Admin</div>
      <div className="flex flex-col gap-2">
        <button
          className="p-1 px-2 bg-primary rounded-md"
          onClick={() => initPool()}
        >
          Init pool
        </button>
        <button
          className="p-1 px-2 bg-primary rounded-md"
          onClick={() => handleBet()}
        >
          Add bet
        </button>
        <button
          className="p-1 px-2 bg-primary rounded-md"
          onClick={() => closePool()}
        >
          Close pool
        </button>
      </div>
    </div>
  );
}
