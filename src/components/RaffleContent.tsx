import { Button } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import NoActiveRaffleForm from "./NoActiveRaffleForm";
import { Contract, utils } from "ethers";
import sultanRaffleAbi from "../abi/sultan-raffle.json";
import { getTokenAllowance, provider } from "@/utils/transactions";
import { erc20ABI, useAccount, useContractWrite } from "wagmi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";

const raffleData = [
  {
    title: "Total Winnings",
    showcase: "800,000",
  },
  {
    title: "Sultans made",
    showcase: "8",
  },
  {
    title: "Trees Planted",
    showcase: "8,000",
  },
  {
    title: "Average winnings",
    showcase: "280,000",
  },
];

const poolSize = 1 * 10 ** 18;

const TOKEN_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

const RaffleContent = () => {
  const { address } = useAccount();

  const {
    data,
    refetch: refetchRaffleInfo,
    isLoading,
  } = useQuery({
    queryKey: ["raffleInfo"],
    queryFn: async () => {
      const tokenContract = new Contract(TOKEN_ADDRESS, erc20ABI, provider);

      const isPoolInitialized = await readContract({
        address: process.env
          .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
        functionName: "poolInitialized",
        abi: sultanRaffleAbi,
      });

      const balance = await tokenContract.balanceOf(
        process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!
      );

      const poolAmount = utils.formatUnits(balance, "ether");
      const tokenSymbol = await tokenContract.symbol();

      return {
        isPoolInitialized,
        balance: +balance,
        poolAmount,
        tokenSymbol,
      };
    },
  });

  const { mutate: handleBet, isLoading: isBetting } = useMutation({
    mutationFn: async () => {
      try {
        const allowance = await getTokenAllowance(
          TOKEN_ADDRESS,
          address as `0x${string}`,
          process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!
        );

        if (allowance === "0.0") {
          const tx = await writeContract({
            address: TOKEN_ADDRESS,
            functionName: "approve",
            abi: erc20ABI,
            args: [
              process.env
                .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
              BigInt(10 * 10 ** 18),
            ],
          });

          await waitForTransaction({ hash: tx.hash });

          console.log("allowance approved");
        }

        const betTx = await writeContract({
          address: process.env
            .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
          functionName: "betOnPool",
          abi: sultanRaffleAbi,
        });

        await waitForTransaction({ hash: betTx.hash });

        console.log("bet placed");

        refetchRaffleInfo();
      } catch (err) {
        console.error(err);
      }
    },
  });

  const progressBarStyle = {
    "--progress": `${((data?.balance || 0) / poolSize) * 100}%`,
  } as React.CSSProperties;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.isPoolInitialized) {
    return (
      <div className="flex justify-center items-center flex-col gap-4 rounded-3xl mt-8 p-8 bg-cardBg w-[550px]">
        <NoActiveRaffleForm />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-4 rounded-3xl p-8 bg-cardBg max-w-[550px]">
        <div
          className="relative rounded-full p-8 w-[300px] h-[300px] flex flex-col justify-center progress-bar"
          style={progressBarStyle}
        >
          <div className="relative z-10 flex justify-center">
            <Image
              src="/gold_chest.svg"
              height={30}
              width={80}
              alt="treasure chest"
              className="w-[180px] h-auto"
            />
          </div>
          <div className="relative z-10">
            <p className="text-2xl mt-4 text-center">
              {data?.poolAmount} {data?.tokenSymbol}
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="w-full">
              <Button
                className="w-full mb-2"
                onClick={() => handleBet()}
                loading={isBetting}
              >
                Join raffle
              </Button>
              <p className="text-xs p-1 text-center max-w-[518px] leading-4">
                Thank You for you generosity. By purchasing this ticket you are
                directly supporting UNICEF&apos;s fight on climate change.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <div className="flex items-center p-8 rounded-3xl bg-cardBg w-full mt-8">
          {raffleData.map((raffle, index) => (
            <div
              key={index}
              className={`pl-8 ${
                index == raffleData.length - 1 ||
                "border-0 border-r border-white pr-8"
              }`}
            >
              <p className="text-sm text-slate-300">{raffle.title}</p>
              <p className="text-2xl">{raffle.showcase}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RaffleContent;
