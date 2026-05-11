import { useEffect, useState } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 2, h: 14, m: 32, s: 18 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((previousTimeLeft) => {
        let { d, h, m, s } = previousTimeLeft;

        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          d = 0;
        }

        return { d, h, m, s };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
      {renderCell(timeLeft.d, "Days")}
      {renderCell(timeLeft.h, "Hrs")}
      {renderCell(timeLeft.m, "Min")}
      {renderCell(timeLeft.s, "Sec")}
    </div>
  );
}
