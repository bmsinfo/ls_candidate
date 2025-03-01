import { z } from 'zod';

import { FieldValidation, ValidationSchema } from './types';
import { DEFAULT_MESSAGES } from './validationMessages';

export const applyValidationRules = (
  schema: ValidationSchema,
  validation: FieldValidation,
  type: string,
  name: string,
): ValidationSchema => {
  const {
    required,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    messages,
    minItems,
    maxItems,
  } = validation;
  let updatedSchema = schema;

  if (!required) {
    if (type === 'number' || type === 'float') {
      updatedSchema = z.union([z.null(), updatedSchema]);
    } else {
      updatedSchema = updatedSchema.optional();
    }
    // return updatedSchema;  // TODO: implement in futrue
  }

  return updatedSchema.superRefine((val, ctx) => {
    // Skip validation if value is empty/null and not required
    if (!required && (val === undefined || val === null || val === '')) {
      return;
    }

    // For required fields or fields with values, apply validation
    if (required && (val === undefined || val === null || val === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages?.required || DEFAULT_MESSAGES.required,
      });
      return;
    }

    if (typeof val === 'number' && val !== null) {
      if (min !== undefined && val < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.min || DEFAULT_MESSAGES.min(min),
        });
      }
      if (max !== undefined && val > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.max || DEFAULT_MESSAGES.max(max),
        });
      }
    }

    if (type === 'checkbox' || type === 'multiselect') {
      // if we dont have minItems or maxItems, but this field is required then we need to add validtion that at least select one option:
      if (
        required &&
        (val.length === 0 || val === null || val === undefined || val === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.required || DEFAULT_MESSAGES.checboxRequired,
        });
      }

      if (minItems !== undefined && val.length < minItems) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.minItems || DEFAULT_MESSAGES.minItems(minItems),
        });
      }
      if (maxItems !== undefined && val.length > maxItems) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.maxItems || DEFAULT_MESSAGES.maxItems(maxItems),
        });
      }
    }

    if (typeof val === 'string' && val !== '') {
      if (minLength !== undefined && val.length < minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.minLength || DEFAULT_MESSAGES.minLength(minLength),
        });
      }
      if (maxLength !== undefined && val.length > maxLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.maxLength || DEFAULT_MESSAGES.maxLength(maxLength),
        });
      }
      if (pattern && !new RegExp(pattern).test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages?.pattern || DEFAULT_MESSAGES.pattern,
        });
      }
    }
  });
};
