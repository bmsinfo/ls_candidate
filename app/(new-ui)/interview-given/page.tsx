import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FrownIcon } from '@/components/ui/icons';
import { INTERVIEW_GIVEN } from '@/lib/constants';

import InterviewAlreadyGiven from './_components/InterviewAlreadyGiven';

const InterviewGiven = async ({ searchParams }: SearchParamProps) => {
  const { interview_status } = searchParams || '';
  const isInterviewGiven = interview_status === INTERVIEW_GIVEN;

  if (isInterviewGiven) {
    return <InterviewAlreadyGiven />;
  }

  return (
    <div className=" h-dvh md:h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <FrownIcon className="mx-auto h-12 w-12 text-red-600" />
          <CardTitle className="text-2xl font-bold">We&apos;re Sorry</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground flex flex-col gap-2">
            <p>
              We regret to inform you that currently your candidature does not
              meet the pre-screening criteria for the current role.
            </p>
            <p>We shall contact you in case of any future opportunities.</p>
            <p> Thank you for your interest in the role.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewGiven;
