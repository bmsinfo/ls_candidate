import React from 'react';

import { FrownIcon } from '@/components/ui/icons';

const FitmentFailed = async () => {
  return (
    <div className="flex h-full items-center justify-center bg-secondaryBlack  bg-opacity-60">
      <div className="flex flex-col items-center justify-center bg-background px-4  sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center ">
          <FrownIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We&apos;re Sorry
          </h1>

          <p className="mt-4 text-muted-foreground">
            We regret to inform you that currently your candidature does not
            meet the fitment criteria for the current role.We shall contact you
            in case of any future opportunities.Thank you for your interest in
            the role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FitmentFailed;
