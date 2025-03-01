import React from 'react';

import FormHeader from '../FormHeader';

const ProfileHeader = () => {
  return (
    <FormHeader>
      <FormHeader.Image src="/icons/add_profile.svg" alt="add profile" />
      <FormHeader.Content>
        <FormHeader.Title>Add Your Profiles</FormHeader.Title>
        <FormHeader.Description>
          Add your social media profiles here.
        </FormHeader.Description>
      </FormHeader.Content>
    </FormHeader>
  );
};

export default ProfileHeader;
