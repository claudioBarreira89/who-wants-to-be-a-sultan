import { Button, Input } from "antd";
import Image from "next/image";
import { useState } from "react";

const RaffleContent = () => {
  const [number, setNumber] = useState(0);
  const min = 1;
  const max = 3;
  let progress = 30;

  const handleDecrease = () => {
    const newNumber = number - 1;
    if (newNumber < min || newNumber > max) return;
    setNumber(prevNumber => prevNumber - 1);
  };

  const handleIncrease = () => {
    const newNumber = number + 1;
    if (newNumber < min || newNumber > max) return;
    setNumber(prevNumber => prevNumber + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      console.log("sejhfbsej");
      setNumber(value);
    }
  };

  const progressBarStyle = {
    '--progress': `${progress}%`,
  } as React.CSSProperties;


  const onRaffleJoin = () => {
    console.log("you joined the raffle");
  }

  return (
    <div className="flex justify-center items-center flex-col gap-4 rounded-3xl p-8 bg-cardBg">
      <div className="relative rounded-full p-8 w-[300px] h-[300px] flex flex-col justify-center progress-bar" style={progressBarStyle}>
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
        <div className="relative z-10 flex justify-center">
          <Image
            src="/treasure-chest.svg"
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
          <div className="flex justify-center gap-2">
            <Button
              className="disabled:bg-gray-100"
              onClick={handleDecrease}
              disabled={number <= min}
            >-</Button>
            <Input
              min={min}
              max={max}
              className="w-8"
              value={number}
              onChange={handleChange}
            />
            <Button
              onClick={handleIncrease}
              disabled={number >= max}
              className="disabled:bg-gray-100"
            >+</Button>
          </div>
          <p className="text-lg mb-4">1 ticket to the raffle costs ~$6. You may purchase up to 3 tickets.</p>

          <Button onClick={onRaffleJoin}>Buy raffle tickets</Button>
        </div>
      </div>
    </div>
  )
}

export default RaffleContent