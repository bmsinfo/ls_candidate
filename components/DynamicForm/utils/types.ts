import { z } from 'zod';

export type FieldType =
  | 'text'
  | 'number'
  | 'float'
  | 'boolean'
  | 'url'
  | 'checkbox'
  | 'date'
  | 'radio';

export interface ValidationMessages {
  required?: string;
  min?: string;
  max?: string;
  minLength?: string;
  maxLength?: string;
  minItems?: string;
  maxItems?: string;
  pattern?: string;
  url?: string;
  type?: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  messages?: ValidationMessages;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  validation?: FieldValidation;
  step?: number | string;
  defaultValue?: any;
  options?: Array<{
    label: string;
    value: string | number | boolean;
  }>;
  icon?: {
    src: string;
    alt: string;
  };
}

export interface CertificateFieldConfig {
  enabled: boolean;
  required: boolean;
  fields: FormFieldConfig[];
  maxEntries?: number;
  messages?: {
    required?: string;
    maxEntries?: string;
  };
}

export interface SectionMessages {
  required?: string;
  maxEntries?: string;
}

export interface FormSectionConfig {
  id: string;
  enabled: boolean;
  numbering?: boolean;
  title?: string;
  description?: string;
  required?: boolean;
  isRepeatable?: boolean;
  maxEntries?: number;
  fields: FormFieldConfig[];
  messages?: SectionMessages;
  defaultValues?: Record<string, any>;
}

export interface FormConfig {
  sections: FormSectionConfig[];
}
export interface FormData {
  [key: string]: string | string[];
}

export type ValidationSchema = z.ZodType<any, any, any>;
