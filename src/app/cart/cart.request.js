class CartRequest{
    transformCart(product,user,qty){
        let cart = {
            orderId:null,
            buyerId:user._id,
            productId:product._id,
            detail:{
                title:product.title,
                price:product.price,
                image:product.images[0]
            },
            qty:qty,
            rate:product.afterDiscount,
            amount:qty*product.afterDiscount,
            seller:product?.seller?._id  || null,
            status:"new"
        }

        return cart;
    }
}

module.exports = CartRequest;