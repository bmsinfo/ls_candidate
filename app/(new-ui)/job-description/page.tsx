'use client';

import React from 'react';

import { notFound } from 'next/navigation';

import TermsAndConditionForm from '@/app/(new-ui)/job-description/TermsAndConditionForm';
import { useStore } from '@/app/store/store';
import CardWrapper from '@/components/CardWrapper';
import DescriptionCard from '@/components/DescriptionCard';
import FaqVideoCard from '@/components/FaqVideoCard';
import JobProfileCard from '@/components/JobProfileCard';
import JobProfileCardMobile from '@/components/JobProfileCardMobile';
import { RingLodderIcon } from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JobDescriptionPage = () => {
  const { intro_message, role_description, job_description, candidate_uid } =
    useStore((state) => state.interview);

  if (!useStore.persist.hasHydrated) {
    return (
      <div className=" h-header items-center justify-center flex">
        <RingLodderIcon className=" size-14" color="#307BF7" />
      </div>
    );
  }

  if (!candidate_uid) {
    return notFound();
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col relative h-screen space-y-6 md:hidden">
        <Tabs defaultValue="introMessage" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="introMessage">Intro Message</TabsTrigger>
            <TabsTrigger value="roleDescription">Role Description</TabsTrigger>
            <TabsTrigger value="jobDescription">Job Description</TabsTrigger>
          </TabsList>
          <TabsContent value="introMessage">
            <div className="px-4 py-3 ">
              <DescriptionCard
                title="Intro Message"
                description={intro_message}
              />
            </div>
          </TabsContent>
          <TabsContent value="roleDescription">
            <div className="px-4 py-3 ">
              <DescriptionCard
                title="Role Description"
                description={role_description}
              />
            </div>
          </TabsContent>
          <TabsContent value="jobDescription">
            <div className="px-4 py-3 ">
              <DescriptionCard
                title="Intro Message"
                description={intro_message}
              />
            </div>
          </TabsContent>
        </Tabs>

        <TermsAndConditionForm />
      </div>

      {/* Desktop */}
      <div className=" hidden md:flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <JobProfileCard />
          <FaqVideoCard />
        </div>
        <CardWrapper>
          <DescriptionCard title="Intro Message" description={intro_message} />
          <DescriptionCard
            title="Role Description"
            description={role_description}
          />
          <DescriptionCard
            hasSeparator={false}
            title="Job Description"
            description={job_description}
          />
          <TermsAndConditionForm classNames="mt-10" />
        </CardWrapper>
      </div>
    </>
  );
};

export default JobDescriptionPage;
