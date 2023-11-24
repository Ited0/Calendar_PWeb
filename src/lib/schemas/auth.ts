import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido").min(5, "Minímo 5 caracteres"),
  password: z.string().min(8, "Minímo 8 caracteres"),
  remember: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email("E-mail inválido").min(5, "Minímo 5 caracteres"),
  password: z.string().min(8, "Minímo 8 caracteres"),
  name:  z.string().min(4, "Minímo 4 caracteres")
});