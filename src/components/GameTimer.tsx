import { useEffect, useState } from 'react';

interface GameTimerProps {
  duration: number; // 秒単位
  onTimeUp: () => void;
}

export function GameTimer({ duration, onTimeUp }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showStop, setShowStop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 1分経過でSTOP表示
    const stopTimer = setTimeout(() => {
      setShowStop(true);
    }, duration * 500); // 残り時間の半分で表示

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, [duration, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center space-y-2">
      <div className="text-4xl font-bold font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {showStop && (
        <div className="text-2xl font-bold text-red-600 animate-pulse">
          STOP
        </div>
      )}
    </div>
  );
} 