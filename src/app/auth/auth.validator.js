const {z} = require('zod')

const regSchema = z.object({
    username : z.string().min(2).max(50),
    email : z.string().email(),
    role : z.string().regex(/admin|customer|seller/).default('customer')
})


module.exports = {regSchema}