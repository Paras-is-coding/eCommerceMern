const { z } = require("zod");

const addToCartSchema = z.object({
    productId:z.string().max(24),
    qty:z.number().min(1)
})


module.exports = addToCartSchema;