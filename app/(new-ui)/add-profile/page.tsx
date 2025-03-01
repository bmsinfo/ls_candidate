import React from 'react';

import CardWrapper from '@/components/CardWrapper';
import FaqVideoCard from '@/components/FaqVideoCard';
import JobProfileCard from '@/components/JobProfileCard';
import TabsForm from '@/components/TabsForm';

const AddProfile = () => {
  return (
    <>
      {/* Desktop */}
      <div className="flex-col space-y-6 hidden md:flex">
        <div className="flex justify-between items-center">
          <JobProfileCard prefix />
          <FaqVideoCard />
        </div>
      </div>

      {/* Mobile and desktop */}
      <CardWrapper className="md:bg-background-mid p-0 py-2 md:p-7 border-none md:border">
        <TabsForm />
      </CardWrapper>
    </>
  );
};

export default AddProfile;
