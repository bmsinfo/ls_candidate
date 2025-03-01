import { FormConfig } from '@/components/DynamicForm/utils/types';

import { VALIDATION_PATTERNS } from '../DynamicForm/utils/patterns';

export const fitmentFormConfig: FormConfig = {
  sections: [
    {
      id: 'fitment-questions',
      enabled: true,
      isRepeatable: false,
      numbering: true,
      fields: [
        {
          name: 'current_ctc',
          label: 'What is your current CTC (in digits) ?',
          type: 'text',
          placeholder: 'Enter your answer',
          step: '1',
          validation: {
            required: true,
            min: 4,
            max: 20,
            pattern: VALIDATION_PATTERNS.DECIMAL, // regex for number with 2 decimal places
            messages: {
              // note : => these error message are optional if not provided then used the default validation messages.
              pattern: 'Please enter a valid number with 2 decimal places',
              //   max: 'Please enter a number less than digits',
              min: 'Please enter a number greater than 4 digits',
              required: 'Please enter your current CTC',
            },
          },
        },
        {
          name: 'expected_ctc',
          label: 'What is your expected CTC (In INR)',
          type: 'text',
          placeholder: 'Enter your answer',
          validation: {
            required: false,
            pattern: VALIDATION_PATTERNS.DECIMAL,
            maxLength: 10,
            minLength: 3,
            messages: {
              required: 'Please enter your expected ctc',
              pattern: 'Please enter a valid number with 2 decimal places',
            },
          },
        },
        {
          name: 'backlog',
          label: 'Do you have backlog in your graduation?',
          type: 'radio',
          placeholder: '',
          validation: {
            required: false,
            messages: {
              required: 'Please select an option',
            },
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
          defaultValue: 'Yes',
        },
        {
          name: 'interests',
          label: 'Please select at least one interest',
          type: 'checkbox',
          validation: {
            required: true,
            messages: {
              // required: 'Please select an option',
            },
          },
          options: [{ label: 'Reading', value: 'reading' }],
          defaultValue: ['reading'],
        },
        {
          name: 'game',
          label: 'Please select at least one game',
          type: 'checkbox',
          validation: {
            required: true,
            minItems: 1, // for checkbox field multiple values
            maxItems: 2, // for checkbox field multiple values
            messages: {
              // required: 'Please select an option',
            },
          },
          options: [
            { label: 'cricket', value: 'cricket' },
            { label: 'TT', value: 'tt' },
            { label: 'football', value: 'football' },
          ],
          defaultValue: [],
        },
        {
          name: 'location',
          label: 'Are you ready to join us at Pune?',
          type: 'radio',
          placeholder: '',
          validation: {
            required: false,
            messages: {
              required: 'Please select an option',
            },
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
          defaultValue: 'No',
        },
        {
          name: 'notice_period',
          label: 'Are you able to join us with 60 days ?',
          type: 'radio',
          placeholder: '',
          validation: {
            required: false,
            messages: {
              required: 'Please select an option',
            },
          },
          options: [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ],
          defaultValue: 'No',
        },
      ],
      defaultValues: {
        backlog: 'Yes',
      },
    },
  ],
};
