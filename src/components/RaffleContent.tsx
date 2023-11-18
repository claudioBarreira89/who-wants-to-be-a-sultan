import { Button } from "antd";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import NoActiveRaffleForm from "./NoActiveRaffleForm";
import { Contract, utils } from "ethers";
import sultanRaffleAbi from "../abi/sultan-raffle.json";
import { getTokenAllowance, provider } from "@/utils/transactions";
import { erc20ABI, useAccount } from "wagmi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import RaffleMessages from "./RaffleMessages";
import Spinner from "./Spinner";

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

      const metadata: any = await readContract({
        address: process.env
          .NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS! as `0x${string}`,
        functionName: "getRaffleMetadata",
        abi: sultanRaffleAbi,
      });

      const balance = await tokenContract.balanceOf(
        process.env.NEXT_PUBLIC_SULTAN_RAFFLE_CONTRACT_ADDRESS!
      );

      const poolAmount = utils.formatUnits(balance, "ether");
      const tokenSymbol = await tokenContract.symbol();

      return {
        name: metadata[0],
        description: metadata[1],
        players: parseInt(metadata[2]),
        raffleWinnings: metadata[3].reduce(
          (acc: any, v: any) => acc + parseInt(v),
          0
        ),
        raffleCounter: metadata[4],
        isPoolInitialized,
        balance: +balance,
        poolAmount,
        tokenSymbol,
      };
    },
  });

  const winnings = data?.raffleWinnings ? data?.raffleWinnings / 10 ** 18 : 0;

  const raffleData = useMemo(
    () => [
      {
        title: "Total Winnings",
        showcase: `${winnings} ${data?.tokenSymbol}`,
      },
      {
        title: "Num. of bets",
        showcase: data?.players,
      },
      {
        title: "Sultans made",
        showcase: data?.raffleCounter.toString(),
      },
      {
        title: "Trees Planted",
        showcase: Math.ceil(winnings / 0.21),
      },
      {
        title: "Average winnings",
        showcase: `${winnings / (parseInt(data?.raffleCounter) || 1)} ${
          data?.tokenSymbol
        }`,
      },
    ],
    [data?.players, data?.raffleCounter, data?.tokenSymbol, winnings]
  );

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

  useEffect(() => {
    const interval = setInterval(() => {
      refetchRaffleInfo();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [refetchRaffleInfo]);

  const progressBarStyle = {
    "--progress": `${((data?.balance || 0) / poolSize) * 100}%`,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="mt-20">
        <Spinner />
      </div>
    );
  }

  if (!data?.isPoolInitialized) {
    return (
      <div className="flex justify-center items-center flex-col gap-4 rounded-3xl mt-8 p-8 bg-cardBg w-[550px]">
        <NoActiveRaffleForm refetchRaffleInfo={refetchRaffleInfo} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-[4]">
        <div className="flex justify-center items-center flex-col gap-4 rounded-3xl p-8 bg-cardBg w-full">
          <div className="text-xl">{data?.name}</div>
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
          <div className="w-full">
            <div className="flex flex-col justify-center gap-4 mt-4">
              <div className="w-full">
                <Button
                  className="w-full mb-2 bg-primary hover:opacity-90 font-bold"
                  onClick={() => handleBet()}
                  style={{
                    color: "white",
                    border: "#ca912b",
                  }}
                  loading={isBetting}
                >
                  Join raffle
                </Button>
                <p className="text-xs p-1 text-center max-w-[518px] leading-4">
                  {data?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[2] pr-[10px]">
        <div className="flex items-start p-8 rounded-3xl bg-cardBg w-full min-h-full overflow-auto">
          <RaffleMessages />
        </div>
      </div>

      <div className="mb-8 w-full">
        <div className="flex items-center justify-between p-8 rounded-3xl bg-cardBg w-full">
          {raffleData.map((raffle, index) => (
            <>
              <div key={index}>
                <p className="text-sm text-slate-300">{raffle.title}</p>
                <p className="text-2xl">{raffle.showcase}</p>
              </div>
              {index !== raffleData.length - 1 && (
                <div className="h-10 w-0.5 bg-white opacity-60" />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaffleContent;
