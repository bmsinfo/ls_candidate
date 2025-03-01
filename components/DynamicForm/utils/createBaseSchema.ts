import { z } from 'zod';

import { ValidationMessages } from './types';
import { DEFAULT_MESSAGES } from './validationMessages';

export const createBaseSchema = (
  type: string,
  messages?: ValidationMessages,
) => {
  switch (type) {
    case 'checkbox':
      return z.array(z.string()).default([]);

    case 'radio':
      return z.string();

    case 'multiselect':
      return z.array(z.string()).default([]);

    case 'number':
      return z.union([
        z.null(),
        z.coerce.number({
          invalid_type_error: messages?.type || DEFAULT_MESSAGES.type.number,
        }),
      ]);

    case 'float':
      return z.union([
        z.null(),
        z.coerce
          .number({
            invalid_type_error: messages?.type || DEFAULT_MESSAGES.type.float,
          })
          .multipleOf(0.01)
          .optional(),
      ]);

    case 'boolean':
      return z.boolean({
        invalid_type_error: messages?.type || DEFAULT_MESSAGES.type.boolean,
      });

    case 'url':
      return z.union([
        z.literal(''),
        z.string().url({ message: messages?.url || DEFAULT_MESSAGES.type.url }),
      ]);

    case 'text':
    default:
      return z.string();
  }
};
