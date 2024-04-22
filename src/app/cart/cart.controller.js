const productSvc = require("../product/product.service");
const CartRequest = require("./cart.request");
const cartSvc = require("./cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    try {
      const { productId, qty } = req.body;

      const product = (await productSvc.getData({ _id: productId }))[0];
      const buyer = req.authUser;

      const data = new CartRequest().transformCart(product, buyer, qty);
      // now add object to cart
      let existingCart = await cartSvc.checkCart(productId, buyer._id);
      // update or insert
      const update = await cartSvc.upsertCart(existingCart, data);

      res.json({
        result: update,
        message: "Successfully added to cart!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  listCart = async (req, res, next) => {
    try {
      let user = req.authUser;
      let filter = { orderId: null };
      if (user.role !== "admin") {
        filter = {
          ...filter,
          buyerId: user._id,
        };
      }
      let detail = await cartSvc.getByFilter(filter);

      res.json({
        result: detail,
        message: "Successfully fetched carts!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
  listOrder = async (req, res, next) => {
    try {
      let user = req.authUser;
      let filter = { orderId: {$ne:null} };
      if (user.role !== "admin") {
        filter = {
          ...filter,
          buyerId: user._id,
        };
      }
      let detail = await cartSvc.getByFilter(filter);

      res.json({
        result: detail,
        message: "Successfully fetched placed orders!",
        meta: {
          total:detail.length
        },
      });
    } catch (error) {
      next(error);
    }
  };
  deleteCartItem = async (req, res, next) => {
    try {
      let { id } = req.params;
      const cartDetails = await cartSvc.getById(id);
      if (!cartDetails) {
        throw { code: 400, message: "Cart does not exists" };
      }

      if (
        req.authUser.role === "admin" ||
        req.authUser._id === cartDetail.buyerId
      ) {
        // admin delete any cart OR user that created cart
        const deleted = await cartSvc.deleteCartById(id);
        res.json({
          result: deleted,
          message: "Successfully deleted cart!",
          meta: null,
        });
      } else {
        throw { code: 403, message: "You can't delete others cart!" };
      }
    } catch (error) {
      next(error);
    }
  };

  placeOrder = async (req, res, next) => {
    try {
      const cartIds = req.body;

      const filter = {
        _id: { $in: cartIds },
        orderId:null
      };

      const billNo = await cartSvc.getBillNo();

      const cart = await cartSvc.getByFilter(filter);
      if(cart.length === 0){
        throw{code:400,message:"Carts has alredy been placed for order!"}
      }
      let subTotal = 0;
      cart.map((item) => {
        subTotal += +item.amount;
      });

      const discount = 0;
      const vatAmount = (subTotal - discount) * 0.13;
      const serviceChange = 100;
      const orderData = {
        billNo: billNo,
        buyer: req.authUser._id,
        subTotal: subTotal,
        discount: discount,
        vatAmount: vatAmount,
        serviceChange: serviceChange,
        amount: subTotal - discount + vatAmount + serviceChange,
        status: "new",
      };

      // insert data now
      const { orderObj, cartUpdated } = await cartSvc.placeOrder(
        orderData,
        cartIds
      );
      // verification notify

      // after order process is complete
      // we can emit event by socket (frontend listen)
      res.json({
        result: orderObj,
        message: "Order placed successfully!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

const cartCtrl = new CartController();

module.exports = cartCtrl;
