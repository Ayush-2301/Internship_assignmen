import { z } from "zod";

export const insertDealSchema = z.object({
  body: z.object({}),
});
