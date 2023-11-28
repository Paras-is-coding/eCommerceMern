const checkLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const categoryCtrl = require('./category.controller');
const { CategoryCreateSchema } = require('./category.validator');

const categoryRouter = require('express').Router()


// Validation
            // Permission  - loggedin admin only can create category
            // File Upload - to handle form data
            // Data Validation - will require categorySchema
            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/category'
    next();
}

categoryRouter.get('/slug/:slug',categoryCtrl.getDetailBySlug);
categoryRouter.get('/home',categoryCtrl.listHome);


categoryRouter.route('/')
    .get(
        checkLogin,
        CheckPermission('admin'),
        categoryCtrl.listAllCategories
        )
    .post(
        checkLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(CategoryCreateSchema),
        categoryCtrl.categoryCreate
        )

categoryRouter.route("/:id")
        .get(
            checkLogin,
            CheckPermission("admin"),
            categoryCtrl.getDataById
        )
        .put(
            checkLogin,
            CheckPermission('admin'),
            dirSet,
            uploader.single('image'),
            ValidateRequest(CategoryCreateSchema),
            categoryCtrl.updateById
        )
        .delete(
            checkLogin,
            CheckPermission("admin"),
            categoryCtrl.deleteById
        )


module.exports = categoryRouter
