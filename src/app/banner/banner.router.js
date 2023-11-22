const checkLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const bannerCtrl = require('./banner.controller');
const { BannerCreateSchema } = require('./banner.validator');

const bannerRouter = require('express').Router()


// Validation
            // Permission  - loggedin admin only can create banner
            // File Upload - to handle form data
            // Data Validation - will require bannerSchema
            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/banner'
    next();
}
     
bannerRouter.get('/home',bannerCtrl.listHome);


bannerRouter.route('/')
    .get(
        checkLogin,
        CheckPermission('admin'),
        bannerCtrl.listAllBanners
        )
    .post(
        checkLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(BannerCreateSchema),
        bannerCtrl.bannerCreate
        )

bannerRouter.route("/:id")
        .get(
            checkLogin,
            CheckPermission("admin"),
            bannerCtrl.getDataById
        )
        .put(
            checkLogin,
            CheckPermission('admin'),
            dirSet,
            uploader.single('image'),
            ValidateRequest(BannerCreateSchema),
            bannerCtrl.updateById
        )
        .delete(
            checkLogin,
            CheckPermission("admin"),
            bannerCtrl.deleteById
        )


module.exports = bannerRouter
