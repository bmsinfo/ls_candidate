import { z } from 'zod';

import { applyValidationRules } from './applyValidationRules';
import { createBaseSchema } from './createBaseSchema';
import {
  FormConfig,
  FormFieldConfig,
  FormSectionConfig,
  ValidationSchema,
} from './types';

const createFieldSchema = (field: FormFieldConfig): ValidationSchema => {
  let schema = createBaseSchema(field.type, field.validation?.messages);

  if (field.validation) {
    schema = applyValidationRules(
      schema,
      field.validation,
      field.type,
      field.name,
    );
  }

  return schema;
};

const createSectionSchema = (section: FormSectionConfig): ValidationSchema => {
  if (!section.enabled) {
    return z.object({}).optional();
  }

  const fieldSchemas = section.fields.reduce<Record<string, ValidationSchema>>(
    (acc, field) => ({
      ...acc,
      [field.name]: createFieldSchema(field),
    }),
    {},
  );

  let sectionSchema: z.ZodSchema<any>;
  if (section.isRepeatable) {
    sectionSchema = z.lazy(() =>
      z.array(z.object(fieldSchemas)).superRefine((val, ctx) => {
        if (section.required && (!val || val.length === 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              section.messages?.required || 'At least one entry is required',
          });
        }
        if (section.maxEntries && val.length > section.maxEntries) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              section.messages?.maxEntries ||
              `No more than ${section.maxEntries} entries are allowed`,
          });
        }
      }),
    );
  } else {
    sectionSchema = z.object(fieldSchemas);
  }

  return sectionSchema;
};

export const createDynamicSchema = (config: FormConfig): z.ZodType<any> => {
  const schemaFields = config.sections.reduce<Record<string, ValidationSchema>>(
    (acc, section) => ({
      ...acc,
      [section.id]: createSectionSchema(section),
    }),
    {},
  );

  return z.object(schemaFields);
};

export type DynamicFormData = z.infer<ReturnType<typeof createDynamicSchema>>;
