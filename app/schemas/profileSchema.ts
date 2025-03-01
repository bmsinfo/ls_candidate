import { z } from 'zod';

export const certificateSchema = z.object({
  certificate_name: z
    .string()
    .min(4, 'Certificate name must be at least 4 characters long')
    .nullable()
    .or(z.literal('')),
  link: z
    .string()
    .startsWith('https://', {
      message: 'Must provide secure URL which starts with https://',
    })
    .url()
    .or(z.literal('')),
  certifying_authority: z
    .string()
    .min(4, 'Authority name must be at least 4 characters long')
    .nullable()
    .or(z.literal('')),
});

export const createSocialMediaSchema = (isIlankCompany: boolean) => {
  return z.object({
    github: z.string().nullable(),
    stackoverflow: z.string().nullable(),
    facebook: z
      .string()
      .url('Must provide secure URL which starts with https://')
      .nullable()
      .or(z.literal('')),
    linkedin: z
      .string()
      .url('Must provide secure URL which starts with https://')
      .nullable()
      .or(z.literal('')),
    certificates: z.array(
      isIlankCompany
        ? certificateSchema.extend({
            link: z.string().url('Invalid certificate URL'),
          })
        : certificateSchema,
    ),
  });
};

export type SocialMediaFormData = z.infer<
  ReturnType<typeof createSocialMediaSchema>
>;
