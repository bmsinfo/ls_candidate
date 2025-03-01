'use client';

import React, { memo } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { useStore } from '@/app/store/store';

import { Button } from './ui/button';

interface JobProfileCardProps {
  prefix?: boolean; // Whether to display prefix labels (e.g. "Job Title", "Candidate Name")
}
const JobProfileCardMobile = ({ prefix = false }: JobProfileCardProps) => {
  const router = useRouter();

  const { job_title, org_name, candidate_full_name } = useStore(
    (state) => state.interview,
  );

  return (
    <div className="flex gap-2 w-full  justify-center flex-col relative md:hidden">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="absolute top-2 border-none rounded-lg left-2"
        size="icon">
        <ArrowLeft className="text-black" />
      </Button>
      <Image
        src="/assets/images/jobDescriptionHero.svg"
        width={100}
        height={100}
        alt="job description hero section"
        className="w-full overflow-hidden w-m-xs:max-h-[220px] w-m-sm:max-h-[320px] w-sm-md:max-h-[420px]  object-cover"
      />
      <div className="flex flex-col gap-1 relative items-center justify-center w-full ">
        <div className="p-4 absolute top-[-35px] bg-background border-2 border-primary rounded-full">
          <Image src="/icons/bag.svg" width={28} height={28} alt="profile" />
        </div>
        <h1 className="font-poppins text-2xl mt-8 font-semibold leading-9 text-grayscale">
          {job_title}
        </h1>
        <h2 className="font-poppins text-sm text-grayscale-mid">{org_name}</h2>
      </div>
    </div>
  );
};

JobProfileCardMobile.displayName = 'JobProfileCardMobile';

export default memo(JobProfileCardMobile);
