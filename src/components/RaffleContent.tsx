import { Button } from "antd";
import Image from "next/image";
import NoActiveRaffleForm from "./NoActiveRaffleForm";

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

const RaffleContent = () => {
  let progress = 30;

  const progressBarStyle = {
    "--progress": `${progress}%`,
  } as React.CSSProperties;

  const onRaffleJoin = () => {
    console.log("you joined the raffle");
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-4 rounded-3xl p-8 bg-cardBg max-w-[550px]">
        <div className="relative rounded-full p-8 w-[300px] h-[300px] flex flex-col justify-center progress-bar" style={progressBarStyle}>
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
            <p className="text-2xl mt-4 text-center">$400,000</p>
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="w-full">
              <Button className="w-full mb-2" onClick={onRaffleJoin}>
                Buy raffle tickets
              </Button>
              <p className="text-xs p-0 max-w-[518px] mt-2">
                Thank You for you generosity. By purchasing this ticket you are
                directly supporting UNICEF&apos;s fight on climate change.
              </p>
              <p className="text-xs p-0 max-w-[518px]">
                1 ticket to the raffle costs ~$6. You may purchase up to 3
                tickets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col gap-4 rounded-3xl mt-8 p-8 bg-cardBg w-[550px]">
        <NoActiveRaffleForm />
      </div>

      <div className="px-8 mb-8">
        <div className="flex items-center p-8 rounded-3xl bg-cardBg w-full mt-8">
          {raffleData.map((raffle, index) => (
            <div
              key={index}
              className={`pl-8 ${index == raffleData.length - 1 ||
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
