const productSvc = require("../product/product.service");
const CartRequest = require("./cart.request");
const cartSvc = require("./cart.service");

class CartController{
    addToCart = async (req,res,next) =>{
        try {
            const {productId,qty} = req.body;
            const product = await productSvc.getData({_id:productId});
            const buyer = req.authUser;
           
      
            

            const data = (new CartRequest()).transformCart(product,buyer,qty);
            // now add object to cart 
            let existingCart = await cartSvc.checkCart(productId,buyer._id);
            // update or insert
            const update = await cartSvc.upsertCart(existingCart,data);



            res.json({
                result:update,
                message:"Successfully added to cart!",
                meta:null
            })
            
        } catch (error) {
            next(error)
            
        }
    }

    listCart = async(req,res,next)=>{
        try {
            let user = req.authUser;
            let filter = {orderId:null};
            if(user.role !== 'admin'){
                filter={
                    ...filter,
                    buyerId:user._id}
            }
            let detail = await cartSvc.getByFilter(filter);


            res.json({
                result:detail,
                message:"Successfully fetched carts!",
                meta:null
            })
        } catch (error) {
            next(error);
            
        }
    }
    deleteCartItem = async (req,res,next)=>{
        try {
            let {id} = req.params;
            const cartDetails = await cartSvc.getById(id);
            if(!cartDetails){
                throw{code:400,message:"Cart does not exists"}
            }

            if(req.authUser.role === 'admin' || req.authUser._id === cartDetail.buyerId){
                // admin delete any cart OR user that created cart
                const deleted = await cartSvc.deleteCartById(id);
                res.json({
                    result:deleted,
                    message:"Successfully deleted cart!",
                    meta:null
                })

            }else{
               throw{code:403,message:"You can't delete others cart!"};

            }
        } catch (error) {
            next(error);
            
        }
    }
}



const cartCtrl  = new CartController()

module.exports = cartCtrl;