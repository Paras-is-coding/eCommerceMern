const userRouter = require('express').Router()
const checkLogin = require('../../middlewares/auth.middleware.js')
const CheckPermission = require('../../middlewares/rbac.middleware.js')
const uploader = require('../../middlewares/uploader.middleware.js')
const ValidateRequest = require('../../middlewares/validate-request.middleware.js')
const userCtrl = require('./user.controller.js')
const { updateUserSchema, createUserSchema } = require('./user.validator.js')


            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/user'
    next();
}

userRouter.get("/by-status/:status",userCtrl.getUserByStatus)
userRouter.get("/by-role/:role",userCtrl.getUserByRole)


userRouter.route('/')
    .get(
        checkLogin,
        CheckPermission('admin'),
        userCtrl.listAllUsers
    )
    .post(
        checkLogin,
        CheckPermission('admin'),
        dirSet,
        uploader.single('image'),
        ValidateRequest(createUserSchema),
        userCtrl.createUserByAdmin
    )


userRouter.route("/:id")
        .get(
            checkLogin,
            CheckPermission("admin"),
            userCtrl.getDataById
        )
        .put(
            checkLogin,
            CheckPermission('admin'),
            dirSet,
            uploader.single('image'),
            ValidateRequest(updateUserSchema),
            userCtrl.updateById
        )
        .delete(
            checkLogin,
            CheckPermission("admin"),
            userCtrl.deleteById
        )

module.exports = userRouter
