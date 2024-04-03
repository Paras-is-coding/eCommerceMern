const CartModel = require("./cart.model");

class CartService{

    checkCart =async (productId, buyer ) =>{
        try {
            let cart = await CartModel.findOne({
                productId:productId,
                buyerId:buyer,
                orderId:null
            })

            return cart;
            
        } catch (error) {
            throw(error);
            
        }
    }

    upsertCart = async(existingCart,updateData) =>{
        try {
           let cart = null;
            if(existingCart){
                cart = CartModel.findByIdAndUpdate({
                    _id:existingCart?._id
                },{
                    $set:updateData
            })
            }else{
                cart = new CartModel(updateData);
                cart = await cart.save();
            }

            return cart;
            
        } catch (error) {
            throw(error)
            
        }
    }

    getByFilter = async(filter)=>{
        try {
            const cartDetail = await CartModel.find(filter)
            .populate('productId',["_id","title",'price','discount','afterDiscount'])
            .populate('buyerId',['_id','name'])
            .populate('seller',['_id','name'])

            return cartDetail;
        } catch (error) {
            throw(error);
            
        }
    }
    getById = async(id)=>{
        try {
            const cartDetail = await CartModel.findById(id)

           return cartDetail;

        } catch (error) {
            throw(error);
            
        }
    }
    deleteCartById = async(id)=>{
        try {
            const cartDetail = await CartModel.findByIdAndDelete(id)

           if(cartDetail){
            return cartDetail;
           }else{
            throw{code:400,message:"Cart does not exist!"}
           }

        } catch (error) {
            throw(error);
            
        }
    }
}


const cartSvc = new CartService()

module.exports = cartSvc;