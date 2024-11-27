import { z } from 'zod'

export const createLengthValidator = (
  min: number,
  max: number,
  message: string,
) =>
  z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length >= min && val.length <= max, { message })
