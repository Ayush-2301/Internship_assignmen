import { z } from "zod";

export const insertCarSchema = z.object({
  body: z.object({
    make: z.string(),
    type: z.string(),
    model: z.string(),
    carInfo: z.object({
      modelYear: z.string(),
      carImages: z.array(z.string()),
    }),
  }),
});

export const updateCarSchema = z.object({
  body: z.object({
    make: z.string().optional(),
    type: z.string().optional(),
    model: z.string().optional(),
    carInfo: z
      .object({
        modelYear: z.string().optional(),
        carImages: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

export const insertMultipleCarSchema = z.object({
  body: z.array(
    z.object({
      make: z.string(),
      type: z.string(),
      model: z.string(),
      carInfo: z.object({
        modelYear: z.string(),
        carImages: z.array(z.string()),
      }),
    })
  ),
});
