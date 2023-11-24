import { z } from "zod";

export const alertSchema = z.union([
  z.literal("15min"),
  z.literal("30min"),
  z.literal("1h"),
  z.literal("2h"),
  z.literal("1d"),
  z.literal("2d"),
  z.literal("1w"),
]);

export const CreateEventSchema = z.object({
  title: z.string().min(3, "Minímo 3 caracteres"),
  location: z.union([z.string().min(3, "Minímo 3 caracteres"), z.literal("")]),
  start: z.date({
    required_error: "Uma data de início é necessária.",
  }),
  end: z.date({
    required_error: "Uma data de término é necessária.",
  }),
  description: z.union([
    z.string().min(8, "Minímo 8 caracteres"),
    z.literal(""),
  ]),
  recurrence: z.union([
    z.literal("daily"),
    z.literal("weekly"),
    z.literal("monthly"),
    z.literal("never"),
  ]),
  alert: z.union([z.literal("none"), z.array(alertSchema)]),
  color: z.string().nullish(),
});

export const EditEventSchema = z
  .object({ id: z.string() })
  .merge(CreateEventSchema);
