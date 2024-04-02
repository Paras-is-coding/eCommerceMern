const { deleteFile } = require("../../config/helper");
const productSvc = require("./product.service")

class ProductController{
    productCreate = async (req,res,next)=>{
        try {
          
            // collect all data move code to services
            let payload = productSvc.transformCreateRequest(req);

            payload.slug = await productSvc.checkSlug(payload.slug);

            if(!payload.images || payload.images === ''){
                delete payload.images;
            }

            // create product
            let created = await productSvc.storeProduct(payload);

            res.json({
                result:created,
                message:"Product created successfully!",  
                meta:null
            })
            
        } catch (error) {
            next(error)
            
        }
    }


    listAllProducts = async (req,res,next)=>{
        try {
            // handle search,sort,paginate
            // search
            let filter={}

            if(req.query['search']){
                filter = {
                    // search keyword on title,status
                    $or:[
                        {title: new RegExp(req.query['search'],'i')},
                        {summary: new RegExp(req.query['search'],'i')},
                        {description: new RegExp(req.query['search'],'i')}
                    ]
                }
            }

            filter = {
                $and:[
                    {createdBy:req.authUser._id},
                    {...filter}
                ]
            }

            // pagination 
            let page = +req.query['page'] || 1;  // + converts string from query to number
            let limit = +req.query['limit'] || 15;

            let total = await productSvc.countData(filter);
            // total=100, 7 page
            // 1st =>0-14, 2nd=>15-29 ...
            let skip = (page-1)*limit;


            let list = await productSvc.listAllData(filter,{offset:skip,limit:limit});
            res.json({
                result:list,
                message:"Product fetched successfully!",
                meta:{
                    total:total,
                    currentPage:page,
                    limit:limit
                }
            })
        } catch (error) {
            next(error)
            
        }
    }



      getDataById = async(req,res,next)=>{
        try {
            const {id} = req.params;
            
            const data = await productSvc.getData({
                _id:id,
                createdBy:req.authUser._id
            });

            res.json({
                result:data,
                message:"Product fetched!",
                meta:null
            })

        } catch (error) {
            next(error)            
        }
    }

    updateById = async (req,res,next)=>{
        try {
            // TOTO:Update Product
            const productId = req.params.id;
      

            // update operation
            const payload = productSvc.transformEditRequest(req);

            if(!payload.images || payload.images === ''){
                delete payload.images;
            }

            const oldProduct = await productSvc.updateById(productId,payload);

            if(payload.images){
                // delete Old image
                deleteFile("./public/uploads/product/",oldProduct.images);
            }


            res.json({
                result:oldProduct,
                message:"Product updated successfully!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }

    deleteById = async(req,res,next)=>{
        try {
            const productId = req.params.id;
            await productSvc.getData({
                _id:productId,
                createdBy:req.authUser._id
            });

            let deleteProduct = await productSvc.deleteById(productId);

            if(deleteProduct.images){
                deleteFile('./public/uploads/product/',deleteProduct.images);
            }

            res.json({
                result:deleteProduct,
                message:"Product Deleted Successfully!",
                meta:null
            })

        } catch (error) {
            next(error);            
        }
    }


    listHome = async (req,res,next)=>{
        try {

            // ---

            let filter={}

            if(req.query['search']){
                filter = {
                    // search keyword on title, url, status
                    $or:[
                        {title: new RegExp(req.query['search'],'i')},
                        {description: new RegExp(req.query['search'],'i')}
                    ]
                }
            }
            filter = {
                $and:[
                    // {createdBy:req.authUser._id},
                    {status:"active"},
                    {...filter}
                ]
            }

            // pagination 
            let page = req.query['page'] || 1;
            let limit = req.query['limit'] || 15;

            let total = await productSvc.countData(filter);    
            // total=100, 7 page
            // 1st =>0-14, 2nd=>15-29 ...
            let skip = (page-1)*limit;

            // ---

            // when we want data sorted from frontend 
            let sort = {_id:"DESC"}
            if(req.query.sort){
                let split = req.query.sort.split(","); // sort=title,desc
                sort = {[split[0]]:split[1]};
            }

            const response = await productSvc.listAllData(filter,{
                offset:skip,
                limit:limit
            },{
                sort:sort
            })

            res.json({
                result:response,
                message:"Product fetched!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }


    getDetailBySlug = async(req,res,next)=>{
        try {
            
            let productDetail = await productSvc.getData({
                slug:req.params.slug,
                status:"active"
            });

            // TODO: Product list
            res.json({
                result:{
                    product:productDetail,
                },
                message:"product Detail from Slug",
                meta:null
            })
        } catch (error) {
            next(error)            
        }
    }
}

const productCtrl = new ProductController()
module.exports = productCtrl
