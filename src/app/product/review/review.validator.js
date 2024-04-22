const { z } = require("zod");

const ReviewCreateSchema = z.object({
  review: z.string(),
  rate: z.number().int().min(1).max(5),
});

const ReviewUpdateSchema = z.object({
  review: z.string(),
  rate: z.number().int().min(1).max(5),
});

module.exports = {
  ReviewCreateSchema,
  ReviewUpdateSchema,
};
