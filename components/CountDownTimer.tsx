import { useState, useEffect } from 'react';

const CountdownTimer = ({ onClose }: { onClose: VoidFunction }) => {
  const [countdown, setCountdown] = useState(300);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (isExpired) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired]);

  return (
    <div className="text-muted-foreground text-[#667085] my-4">
      {isExpired ? (
        <div className="text-red-500 md:text-base text-sm font-medium">
          The OTP has expired.
        </div>
      ) : (
        <div>
          OTP expires in{' '}
          <span className="font-medium">
            {Math.floor(countdown / 60)}:
            {String(countdown % 60).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* <Button type="button">Re-send OTP</Button> */}
    </div>
  );
};

export default CountdownTimer;
