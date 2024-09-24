import React, { useState, useEffect } from "react";

interface MatchTimerProps {
  duration: number;
  onTimeUp: () => void;
}

const MatchTimer: React.FC<MatchTimerProps> = ({ duration, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration);

  useEffect(() => {
    if (remainingTime > 0) {
      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      onTimeUp();
    }
  }, [remainingTime, onTimeUp]);

  return (
    <div className="w-[120px] text-center text-4xl font-bold leading-none">
      {`${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, "0")}`}
    </div>
  );
};

export default MatchTimer;
