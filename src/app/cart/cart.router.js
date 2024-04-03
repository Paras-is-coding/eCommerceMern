const checkLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const cartCtrl = require('./cart.controller');
const addToCartSchema = require('./cart.validator');

const cartRouter = require('express').Router();


cartRouter.post('/add',
checkLogin,
CheckPermission(['customer','admin']),
ValidateRequest(addToCartSchema),
cartCtrl.addToCart
)

cartRouter.get('/list',
checkLogin,
CheckPermission(['customer','admin']),
cartCtrl.listCart
)
cartRouter.delete('/delete/:id',
checkLogin,
CheckPermission(['customer','admin']),
cartCtrl.deleteCartItem
)

module.exports=  cartRouter;