import Image from 'next/image';

import { CircleScatterSVG } from '@/components/ui/icons';

export default function Home() {
  return (
    <main>
      <div className="hidden md:block flex min-h-screen w-screen relative justify-center bg-main items-center opacity-95">
        <div className=" absolute inset-0 -z-10 flex h-full w-full">
          <CircleScatterSVG className=" w-full h-full" />
        </div>

        <div className="flex items-center justify-center flex-col opacity-100">
          <h4 className="text-2xl font-extralight tracking-wider text-white">
            Your Interview Assistant
          </h4>
          <h1 className="mt-4 mb-7 text-[55px] font-extralight tracking-[2px] text-white">
            The Best <span className=" font-semibold text-main">Humanoid</span>{' '}
            Interviewer
          </h1>
          <p className=" m-auto mb-8 max-w-4xl text-white">
            Introducing LegoSapien, a groundbreaking solution designed to
            revolutionize the hiring process and transform the way organizations
            build their dream teams. Say goodbye to traditional hiring
            challenges and welcome a new Humanoid era of Interactive,
            Intelligent, Near Real world, Accurate 1st of a kind Interview
            System.
          </p>
        </div>
      </div>
      <div
        className="min-h-screen md:hidden block bg-cover bg-center flex flex-col justify-between"
        style={{
          backgroundImage:
            'url(/assets/images/mobileDashboard.svg), linear-gradient(180deg, rgba(37, 117, 249, 0.14) 0%, #2575F9 77.77%)',
          backgroundBlendMode: 'overlay',
        }}>
        <div className="flex-grow"></div>
        <div className="flex items-center justify-center pb-8">
          <Image
            src="/assets/images/logo.svg"
            width={100}
            height={100}
            className="h-auto w-[260px]"
            alt="mobile dashboard"
          />
        </div>
      </div>
    </main>
  );
}
