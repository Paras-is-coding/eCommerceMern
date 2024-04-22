const { z } = require("zod");

const ProductCreateSchema = z.object({
    title:z.string().min(2),
    summary:z.string().nullable(),
    description:z.string().nullable(),
    category:z.string().nullable(),
    price:z.string().regex(/^\d+$/),
    discount:z.string().regex(/^\d+$/).min(0).max(100).nullable(),
    brand:z.string().nullable(),
    
    attributes:z.array( z.object({
        key: z.string(),
        value: z.array(z.string())
    })).nullable().optional(),

    tags:z.string().nullable(),
    sellerId:z.string().nullable(),
    status:z.string().regex(/active|inactive/).default('inactive')
})


module.exports = {
    ProductCreateSchema
}