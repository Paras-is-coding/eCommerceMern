const userRouter = require('express').Router()
// const { accessCheck } = require('../../middlewares/accessCheck.middleware.js')
const checkLogin = require('../../middlewares/auth.middleware.js')
const CheckPermission = require('../../middlewares/rbac.middleware.js')
const uploader = require('../../middlewares/uploader.middleware.js')
// const Validator = require('../../middlewares/validator.middleware.js')
const userCtrl = require('./user.controller.js')
// const userSvc = require('./user.service.js')
// const { UserCreateSchema } = require('./user.validator.js')


            
const dirSet = (req,res,next)=>{
    req.uploadDir = './public/uploads/user'
    next();
}

// userRouter.get('/slug/:slug',userCtrl.getDetailBySlug);
// userRouter.get('/home',userCtrl.listHome);

userRouter.get("/by-status/:status",userCtrl.getUserByStatus)
userRouter.get("/by-role/:role",userCtrl.getUserByRole)


// userRouter.route('/')
//     .get(
//         checkLogin,
//         CheckPermission('admin'),
//         userCtrl.listAllUsers
//     )
  


// userRouter.route("/:id")
//         .get(
//             checkLogin,
//             CheckPermission("admin"),
//             userCtrl.getDataById
//         )
//         .put(
//             checkLogin,
//             CheckPermission('admin'),
//             dirSet,
//             uploader.array('images'),
//             Validator(UserCreateSchema),
//             accessCheck(userSvc),
//             userCtrl.updateById
//         )
//         .delete(
//             checkLogin,
//             CheckPermission("admin"),
//             userCtrl.deleteById
//         )

module.exports = userRouter
