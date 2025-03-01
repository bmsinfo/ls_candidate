import Image from 'next/image';

import { Button } from './ui/button';

interface ButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
  children: React.ReactNode;
}

const SubmitButton = ({
  disabled,
  isLoading,
  className,
  loadingText,
  children,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      variant="nohover"
      disabled={disabled ?? isLoading}
      className={`
      ${className}
      ${disabled || isLoading ? 'bg-grayscale-mid-secondary' : ' bg-blue-500 hover:bg-primary-DEFAULT'}
      transition-colors duration-200 ease-in-out shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]  text-white font-normal py-3
    `}>
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          {loadingText ?? 'Loading...'}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
