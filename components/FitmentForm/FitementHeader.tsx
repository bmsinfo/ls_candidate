import React from 'react';

import FormHeader from '../FormHeader';

const FitementHeader = () => {
  return (
    <FormHeader>
      <FormHeader.Content>
        <FormHeader.Title>Prescreening Questions</FormHeader.Title>
        <FormHeader.Description className="text-accent-red">
          Please answer these questions
        </FormHeader.Description>
      </FormHeader.Content>
    </FormHeader>
  );
};

export default FitementHeader;
