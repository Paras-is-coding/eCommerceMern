const { z } = require("zod");

const BannerCreateSchema = z.object({
    title:z.string().min(3),
    url:z.string().url().nullable(),
    status:z.string().regex(/active|inactive/)
})


module.exports = {
    BannerCreateSchema
}