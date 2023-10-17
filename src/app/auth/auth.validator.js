const {z} = require('zod')

const regSchema = z.object({
    username : z.string().min(2).max(50),
    email : z.string().email(),
    role : z.string().regex(/admin|customer|seller/).default('customer')
})

const passwordSchema = z.object({
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/),
    confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm Password does not match",
    path: ["confirmPassword"]
})

module.exports = {regSchema,passwordSchema}