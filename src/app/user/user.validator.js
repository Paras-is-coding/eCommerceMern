const z = require('zod');

const createUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    status: z.enum(["active", "inactive"]).optional(),
    address: z.object({
        shipping: z.string().optional(),
        billing: z.string().optional()
    }).optional(),
    role: z.enum(["admin", "seller", "customer"]),
    phone: z.string().optional(),
});


const updateUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    status: z.enum(["active", "inactive"]).optional(),
    address: z.object({
        shipping: z.string().optional(),
        billing: z.string().optional()
    }).optional(),
    role: z.enum(["admin", "seller", "customer"]).optional(),
    phone: z.string().optional(),
});

module.exports = {updateUserSchema,createUserSchema};
