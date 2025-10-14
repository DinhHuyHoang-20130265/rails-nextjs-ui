export const startCountdown = (initialTime: number, onTick: (time: number) => void, onComplete: () => void) => {
  let time = initialTime;
  
  const timer = setInterval(() => {
    time--;
    onTick(time);
    
    if (time <= 0) {
      clearInterval(timer);
      onComplete();
    }
  }, 1000);
  
  return timer;
};

export const formatOtpInput = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
};
