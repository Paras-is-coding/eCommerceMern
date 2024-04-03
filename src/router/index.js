const router = require('express').Router();
const authRouter = require('../app/auth/auth.router.js');
const bannerRouter = require('../app/banner/banner.router.js');
const brandRouter = require('../app/brand/brand.router.js');
const categoryRouter = require('../app/category/category.router.js');
const productRouter = require('../app/product/product.router.js');
const userRouter = require('../app/user/user.router.js');

const cartRouter = require('../app/cart/cart.router.js');



// mounting authRouter to our main app router
router.use(authRouter);
router.use('/banner',bannerRouter);
router.use('/brand',brandRouter);
router.use('/category',categoryRouter);
router.use('/product',productRouter);
router.use('/user',userRouter);

router.use('/cart',cartRouter);



module.exports = router;