import { FormConfig } from '@/components/DynamicForm/utils/types';

import { VALIDATION_PATTERNS } from '../DynamicForm/utils/patterns';

// Example configuration showing different types of form sections
export const profileFormConfig: FormConfig = {
  sections: [
    {
      id: 'socialProfiles',
      enabled: true,
      //   title: 'Social Media Profiles',
      //   description: 'Add your professional social media profiles',
      isRepeatable: false,
      fields: [
        {
          name: 'github',
          label: 'GitHub Username',
          type: 'text',
          placeholder: 'Enter your GitHub username',
          validation: {
            required: false,
            minLength: 3,
            maxLength: 39,
            pattern: '^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$',
            messages: {
              // note : => these error message are optional if not provided then used the default validation messages.
              pattern: 'Please enter a valid GitHub URL',
            },
          },
          icon: {
            src: '/icons/github.svg',
            alt: 'github',
          },
        },
        {
          name: 'stackoverflow',
          label: 'StackOverflow ID',
          type: 'number',
          step: '.5', // use in case of number field
          placeholder: 'Enter your StackOverflow ID',
          validation: {
            required: true,
            pattern: VALIDATION_PATTERNS.INTEGER,
            messages: {
              required: 'Please enter your StackOverflow ID',
            },
          },
          icon: {
            src: '/icons/stack-overflow.svg',
            alt: 'stackoverflow',
          },
        },
        {
          name: 'linkedin',
          label: 'LinkedIn URL',
          type: 'url',
          placeholder: 'Enter your LinkedIn profile URL',
          validation: {
            required: true,
            pattern: '^https://www\\.linkedin\\.com/.*$',
            messages: {
              pattern: 'Must be a valid LinkedIn profile URL',
              url: 'Please enter a valid LinkedIn URL starting with https://www.linkedin.com/',
            },
          },
          icon: {
            src: '/icons/linkedin.svg',
            alt: 'linkedin',
          },
        },
        {
          name: 'facebook',
          label: 'Facebook URL',
          type: 'url',
          placeholder: 'Enter your Facebook URL',
          validation: {
            required: false,
            pattern: '^https://www\\.facebook\\.com/.*$',
            messages: {
              pattern: 'Must be a valid Facebook profile URL',
              url: 'Please enter a valid Facebook URL starting with https://www.facebook.com/',
            },
          },
          icon: {
            src: '/icons/facebook.svg',
            alt: 'facebook',
          },
        },
      ],
    },
    {
      id: 'certifications',
      enabled: true,
      title: 'Certifications',
      description: 'Add your certifications',
      isRepeatable: true,
      required: true,
      maxEntries: 5,
      //   defaultValues: [
      //     {
      //       certificate_name: '',
      //       certifying_authority: '',
      //       link: '',
      //     },
      //   ],
      fields: [
        {
          name: 'certificate_name',
          label: 'Certificate Name',
          type: 'text',
          placeholder: 'Enter Certificate Name',
          validation: {
            required: false,
            minLength: 3,
            messages: {
              required: 'Certificate Name is required',
            },
          },
        },

        {
          name: 'link',
          label: 'Certificate URL',
          type: 'url',
          placeholder: 'Enter Certificate URL',
          validation: {
            required: false,
            messages: {
              required: 'Certificate URL is required',
              url: 'Please enter a valid certificate URL',
            },
          },
        },
        {
          name: 'certifying_authority',
          label: 'Certificate Authority',
          type: 'text',
          placeholder: 'Enter Certificate Authority',
          validation: {
            required: false,
            messages: {
              required: 'Certifying authority is required',
            },
          },
        },
      ],
      messages: {
        required: 'Please add at least one work experience',
        maxEntries: 'Maximum 5 work experiences allowed',
      },
    },
  ],
};
