'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ArrowLeft } from 'lucide-react';

import { sections } from '@/constants/sections';

const TermsAndConditionDetail = ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { slug } = params;
  const router = useRouter();

  const section = sections.find((section) => section.slug === slug);
  return (
    <div className="container mx-auto p-4 sm:px-6 lg:px-14 h-screen w-full">
      <h1
        onClick={() => router.back()}
        className="text-lg cursor-pointer font-semibold mb-4 flex items-center gap-2 ">
        <ArrowLeft size={20} />
        {section?.title}
      </h1>
      <ScrollArea className="h-screen">
        {section ? (
          <div
            className={`py-3 px-4 last:mb-0 w-full rounded-md border-[1px] border-gray-bright overflow-hidden`}>
            <div className=" font-roboto text-[16px] font-normal leading-[28px] text-left text-grayscale-dark">
              {section.content}
            </div>
          </div>
        ) : (
          <div className="py-4 px-6 font-roboto text-[16px] font-normal leading-[28px] text-left text-grayscale-dark">
            Section not found.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TermsAndConditionDetail;
