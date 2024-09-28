import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";

interface MatchTimerProps {
  className?: string;
  duration: number;
  onTimeUp: () => void;
}

const MatchTimer: React.FC<MatchTimerProps> = ({
  className,
  duration,
  onTimeUp,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration);
  const endTimeRef = useRef<number>(Date.now() + duration * 1000);

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.floor((endTimeRef.current - now) / 1000),
      );
      setRemainingTime(remaining);

      if (remaining === 0) {
        onTimeUp();
        clearInterval(timerId);
      }
    };

    const timerId = setInterval(updateRemainingTime, 1000);

    updateRemainingTime();

    return () => clearInterval(timerId);
  }, [onTimeUp]);

  return (
    <div
      className={cn(
        "w-[120px] text-center text-4xl font-bold leading-none",
        className,
      )}
    >
      {`${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(
        2,
        "0",
      )}`}
    </div>
  );
};

export default MatchTimer;
