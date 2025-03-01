'use client';

import React, { memo } from 'react';

import Image from 'next/image';

import { useStore } from '@/app/store/store';

interface JobProfileCardProps {
  prefix?: boolean; // Whether to display prefix labels (e.g. "Job Title", "Candidate Name")
}
const JobProfileCard = ({ prefix = false }: JobProfileCardProps) => {
  const { job_title, org_name, candidate_full_name } = useStore(
    (state) => state.interview,
  );

  const renderJobTitle = () => {
    if (prefix) {
      return (
        <div className="flex h-6 items-center">
          <Image src="/icons/bag.svg" width={24} height={21} alt="profile" />
          <h2 className="font-20-23-400 ml-2">Job Title: {job_title}</h2>
        </div>
      );
    }

    return <h1 className="font-32-37.5-400">{job_title}</h1>;
  };

  const renderCompanyNameOrCandidateName = () => {
    const iconPath = prefix ? '/icons/people.svg' : '/icons/bag.svg';
    const altText = prefix ? 'people' : 'profile';
    const content = prefix
      ? `Candidate Name: ${candidate_full_name}`
      : org_name;

    return (
      <div className="flex h-6 items-center">
        <Image src={iconPath} width={24} height={21} alt={altText} />
        <h2 className="font-20-32-400 ml-2">{content}</h2>
      </div>
    );
  };

  return (
    <div className="h-92px flex gap-2 justify-center flex-col">
      {renderJobTitle()}
      {renderCompanyNameOrCandidateName()}
    </div>
  );
};

JobProfileCard.displayName = 'JobProfileCard';

export default memo(JobProfileCard);
