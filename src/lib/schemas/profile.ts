import { z } from "zod";
import validator from "validator";

export const ProfileSchema = z.object({
  displayName: z.string().min(3, "Minímo 3 caracteres"),
  phoneNumber: z.union([
    z.string().refine(validator.isMobilePhone),
    z.literal(""),
  ]),
  photoURL: z.union([z.string().url(), z.literal("")]),
});

export const EditProfileSchema = z.object({}).merge(ProfileSchema);
