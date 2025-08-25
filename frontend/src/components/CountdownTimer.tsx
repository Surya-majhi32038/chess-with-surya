import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  start: boolean; // Prop to control when to start countdown
  onTimeUp?: () => void; // Optional callback when countdown reaches 0
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ start,onTimeUp }) => {
  const [seconds, setSeconds] = useState(59);
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    if (start) {
      setSeconds(59); // Reset the timer on every start signal
    }
  }, [start]);

  useEffect(() => {
    if (!start || seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
            clearInterval(timer);
            onTimeUp?.(); // Notify parent when timer hits 0
            return 0;
          }
          return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [start, seconds]);

  // Trigger blinking when seconds < 10
  useEffect(() => {
    if (seconds < 10 && start && seconds !== 0) {
      setBlinking(true);
    } else {
      setBlinking(false);
    }
    console.log(blinking)
  }, []);

  const formatTime = (s: number) => `0:${s < 10 ? `0${s}` : s}`;

  return (
    <div
      className={`rounded-md px-4 ph:px-2 py-2 flex items-center gap-2 shadow-md transition-colors duration-300 ${
        seconds < 10 && start ? "bg-red-500 animate-pulse" : "bg-white"
      }`}
    >
      <Clock className={`w-5 ph:w-4 bg-transparent h-5 ${seconds < 10 && start ? "text-white" : "text-black"}`} />
      <span
        className={`text-lg ph:text-sm bg-transparent font-semibold ${
          seconds < 10 && start ? "text-white " : "text-black "
        }`}
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;
