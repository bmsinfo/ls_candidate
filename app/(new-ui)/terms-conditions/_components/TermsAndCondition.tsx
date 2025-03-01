/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ChevronRight } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { sections } from '@/constants/sections';

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

/* eslint-disable react/no-unescaped-entities */

export default function TermsAndConditionSection() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const router = useRouter();
  const scrollingRef = useRef(false);
  const handleSectionClick = useCallback((index: number) => {
    scrollingRef.current = true;

    setActiveSection(index);
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setTimeout(() => {
      scrollingRef.current = false;
    }, 500);
  }, []);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const index = sectionRefs.current.findIndex(
  //             (section) => section === entry.target,
  //           );
  //           if (index !== -1) {
  //             setActiveSection(index);
  //           }
  //         }
  //       });
  //     },
  //     {
  //       root: null,
  //       threshold: 0.09,
  //     },
  //   );

  //   // Observe each section
  //   sectionRefs.current.forEach((section) => {
  //     if (section) observer.observe(section);
  //   });

  //   return () => {
  //     // Cleanup the observer
  //     sectionRefs.current.forEach((section) => {
  //       if (section) observer.unobserve(section);
  //     });
  //   };
  // }, []);

  return (
    <>
      {/* desktop view */}
      <div className="flex hidden md:flex font-robot flex-row gap-6 mb-5 w-full">
        <ScrollArea className="h-[calc(100vh-110px)]  hidden md:block">
          <h1 className="text-2xl font-bold mb-4">Candidate Verification</h1>
          <div className="h-full flex flex-col gap-3">
            {sections.map((section, index) => (
              <button
                key={index}
                className={`block bg-grayscale-light-background w-full text-left  overflow-hidden border-[1px] rounded-[10px] ${index === activeSection ? 'text-grayscale-dark font-semibold' : 'text-grayscale-gray-v'}`}
                onClick={() => handleSectionClick(index)}>
                <div className="flex w-full gap-3 h-full text-[16px] font-normal leading-[24px] text-left text-wrap max-w-[396px] pr-3 items-center ">
                  <div
                    className={`h-[56px] w-1 min-h-full bg-primary ${index === activeSection ? 'bg-primary' : 'bg-transparent'}`}></div>
                  {section.title}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="flex-1 px-4">
          <ScrollArea className="h-[calc(100vh-110px)]">
            {sections.map((section, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current[index] = el;
                  }
                }}
                className={`mb-6 last:mb-0 w-full rounded-md border-[1px] border-gray-bright overflow-hidden`}>
                <h1
                  className={`${index === activeSection ? 'bg-primary text-white' : 'bg-grayscale-light-background text-grayscale-dark'} font-roboto px-6 border-gray-bright py-4 text-[24px] font-semibold leading-[32px] text-left border-b-[1px] `}>
                  {section.title}
                </h1>
                <div className="py-4 px-6 font-roboto text-[16px] font-normal leading-[28px] text-left text-grayscale-dark">
                  {section.content}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* mobile view */}
      <div className="container md:hidden mx-auto p-4 sm:px-6 lg:px-14 h-screen w-full">
        <h1
          onClick={() => router.back()}
          className="text-base cursor-pointer font-normal mb-4 flex items-center gap-2 ">
          <ArrowLeft size={20} />
          Terms & Condition
        </h1>
        <ScrollArea className="h-[calc(100vh-110px)]">
          <div className="h-full flex flex-col gap-3">
            {sections.map((section, index) => (
              <Link
                href={`/terms-conditions/${section.slug}`}
                key={index}
                legacyBehavior>
                <button
                  key={index}
                  className={` bg-grayscale-light-background w-full text-left  overflow-hidden border-[1px] rounded-[10px] border-primary-border-light`}>
                  <div className="flex w-full h-full flex items-center justify-between h-[56px] gap-3 text-[16px] font-normal leading-[24px] text-left text-wrap max-w-[396px] p-3 ">
                    <p>{section.title}</p>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
