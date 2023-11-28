const { z } = require("zod");

const CategoryCreateSchema = z.object({
    title:z.string().min(3),
    description:z.string().nullable(),
    status:z.string().regex(/active|inactive/).default('inactive'),
    parentId:z.string().nullable()
})


module.exports = {
    CategoryCreateSchema
}