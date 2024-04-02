const productRouter = require('express').Router()
const { accessCheck } = require('../../middlewares/accessCheck.middleware.js')
const checkLogin = require('../../middlewares/auth.middleware.js')
const CheckPermission = require('../../middlewares/rbac.middleware.js')
const uploader = require('../../middlewares/uploader.middleware.js')
const Validator = require('../../middlewares/validator.middleware.js')
const productCtrl = require('./product.controller.js')
const productSvc = require('./product.service.js')
const { ProductCreateSchema } = require('./product.validator.js')

// Validation
            // Permission  - loggedin admin only can create product
            // File Upload - to handle form data
            // Data Validation - will require productSchema
            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/product'
    next();
}

productRouter.get('/slug/:slug',productCtrl.getDetailBySlug);
productRouter.get('/home',productCtrl.listHome);

productRouter.route('/')
    .get(
        checkLogin,
        CheckPermission('admin'),
        productCtrl.listAllProducts
    )
    .post(
        checkLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.array('images'),
        Validator(ProductCreateSchema),
        productCtrl.productCreate
        )



productRouter.route("/:id")
        .get(
            checkLogin,
            CheckPermission("admin"),
            productCtrl.getDataById
        )
        .put(
            checkLogin,
            CheckPermission('admin'),
            dirSet,
            uploader.array('images'),
            Validator(ProductCreateSchema),
            accessCheck(productSvc),
            productCtrl.updateById
        )
        .delete(
            checkLogin,
            CheckPermission("admin"),
            productCtrl.deleteById
        )

module.exports = productRouter
