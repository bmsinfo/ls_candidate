import { z } from "zod";
import {
  ANSWER,
  CERTIFICATES,
  FACEBOOK,
  GITHUB,
  LINKEDIN,
  STACKOVERFLOW,
} from "./constants";

export const SendOTPFormValidation = z.object({
  candidate_email: z.string().email("Invalid email address"),
});

export const verifyOTPFormValidation = z.object({
  otp: z.string().min(6),
});

export const urlOrNullOrEmptyString = z
  .string()
  .nullable()
  .refine(
    (value) => !value || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
    { message: "URL is not valid" }
  );

export const socialMediaFormValidation = z.object({
  [GITHUB]: z.string().nullable(),
  [STACKOVERFLOW]: z.string().nullable(),
  [FACEBOOK]: urlOrNullOrEmptyString,
  [LINKEDIN]: urlOrNullOrEmptyString,
  [CERTIFICATES]: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(), // make url required and validate as URL
      authority: z.string(),
    })
  ),
});

export const submitAnswerrValidation = z.object({
  [ANSWER]: z.string(),
});
