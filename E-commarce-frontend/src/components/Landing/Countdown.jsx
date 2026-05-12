import { useEffect, useState } from "react";


function extractTime(date) {
  if (!date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  let remainingTime = date;

  if (typeof date === "string" || date instanceof Date) {
    remainingTime = new Date(date).getTime() - Date.now();
  }

  if (typeof remainingTime !== "number" || Number.isNaN(remainingTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  remainingTime = Math.max(0, remainingTime);

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  console.log({ days, hours, minutes, seconds });
  return { days, hours, minutes, seconds };
}

export default function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState(() => extractTime(date));

  useEffect(() => {
    setTimeLeft(extractTime(date));

    const intervalId = setInterval(() => {
      setTimeLeft((previousTimeLeft) => {
        let { days, hours, minutes, seconds } = previousTimeLeft;

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          return previousTimeLeft;
        }

        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  function renderCell(value, label) {
    return (
      <div className="flex flex-col items-center">
        <div className="min-w-[52px] rounded-lg bg-background/95 px-3 py-2 text-center text-xl font-bold tabular-nums text-foreground">
          {String(value).padStart(2, "0")}
        </div>
        <span className="mt-1 text-[10px] uppercase tracking-wider opacity-80">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {renderCell(timeLeft.days, "Days")}
      {renderCell(timeLeft.hours, "Hrs")}
      {renderCell(timeLeft.minutes, "Min")}
      {renderCell(timeLeft.seconds, "Sec")}
    </div>
  );
}
