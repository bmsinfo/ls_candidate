'use client';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-130px)]">
      <div className="text-center flex flex-col justify-center gap-5 items-center">
        <Image
          className="w-60 sm:w-72 md:w-80"
          src="/notFound.svg"
          height={0}
          width={0}
          alt="Not Found Image"
        />
        <p className="font-roboto text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[24px] sm:leading-[28px] md:leading-[32px] text-center text-black">
          We can’t find what you’re looking for. Don’t worry, we all make wrong
          turns sometimes. <br />
          Let’s get you back on track!
        </p>
        <a
          href="/"
          className="bg-primary p-[12px_24px] rounded-[4px] font-semibold	text-xl text-white">
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
