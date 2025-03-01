import { FieldType } from './types';

type TypeMessages = {
  [key in FieldType]: string;
};

export interface DefaultMessages {
  required: string;
  checboxRequired: string;
  min: (min: number) => string;
  max: (max: number) => string;
  minItems: (min: number) => string;
  maxItems: (max: number) => string;
  minLength: (min: number) => string;
  maxLength: (max: number) => string;
  pattern: string;
  url: string;
  type: TypeMessages;
}

export const DEFAULT_MESSAGES: DefaultMessages = {
  required: 'This field is required',
  checboxRequired: 'Checkbox is required',
  min: (min: number) => `Value must be at least ${min}`,
  minItems: (min: number) => `Please select at least ${min} options`,
  maxItems: (max: number) => `Please select only ${max} options`,
  max: (max: number) => `Value must be at most ${max}`,
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  pattern: 'Invalid format',
  url: 'Must be a valid URL',
  type: {
    text: 'Must be valid text',
    number: 'Must be a valid number',
    float: 'Must be a valid decimal number',
    boolean: 'Must be true or false',
    url: 'Must be a valid URL',
    checkbox: 'Must be checked',
    date: 'Must be a valid date',
    radio: 'Must be selected',
  },
};
