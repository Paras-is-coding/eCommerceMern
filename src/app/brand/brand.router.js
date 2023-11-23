const checkLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const brandCtrl = require('./brand.controller');
const { BrandCreateSchema } = require('./brand.validator');

const brandRouter = require('express').Router()


// Validation
            // Permission  - loggedin admin only can create brand
            // File Upload - to handle form data
            // Data Validation - will require brandSchema
            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/brand'
    next();
}

brandRouter.get('/slug/:slug',brandCtrl.getDetailBySlug);
brandRouter.get('/home',brandCtrl.listHome);


brandRouter.route('/')
    .get(
        checkLogin,
        CheckPermission('admin'),
        brandCtrl.listAllBrands
        )
    .post(
        checkLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(BrandCreateSchema),
        brandCtrl.brandCreate
        )

brandRouter.route("/:id")
        .get(
            checkLogin,
            CheckPermission("admin"),
            brandCtrl.getDataById
        )
        .put(
            checkLogin,
            CheckPermission('admin'),
            dirSet,
            uploader.single('image'),
            ValidateRequest(BrandCreateSchema),
            brandCtrl.updateById
        )
        .delete(
            checkLogin,
            CheckPermission("admin"),
            brandCtrl.deleteById
        )


module.exports = brandRouter
