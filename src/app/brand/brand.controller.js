const { deleteFile } = require('../../config/helper.js');
const brandSvc = require('./brand.services.js')

class BrandController{
    brandCreate = async (req,res,next)=>{
        try {
            // DB operation  

            // collect all input data, move code to services
            let payload = brandSvc.transformCreateRequest(req);

             // to not update image if null or undefined
             if(!payload.image || payload.image === ''){
                delete payload.image;
            }
            
            // create brand
            let created = await brandSvc.storeBrand(payload);

            res.json({
                result:created,
                message:"Brand created successfully!",  
                meta:null
            })
            
        } catch (error) {
            next(error)
            
        }
    }


    
    listAllBrands = async (req,res,next)=>{
        try {
            //handle search,sort,paginate
            // search
            let filter={}

            if(req.query['search']){
                filter = {
                    // search keyword on title, url, status
                    $or:[
                        {title: new RegExp(req.query['search'],'i')},
                        {status: new RegExp(req.query['search'],'i')}
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
             let page = req.query['page'] || 1;
             let limit = req.query['limit'] || 15;
 
             let total = await brandSvc.countData(filter);
             // total=100, 7 page
             // 1st =>0-14, 2nd=>15-29 ...
             let skip = (page-1)*limit;

            let list = await brandSvc.listAllData(filter,{offset:skip,limit:limit});
            res.json({
                result:list,
                message:"Brand fetched successfully!",
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
            const {id} = req.params.id;
            const data = await brandSvc.getById({
                id:id,
                createdBy:req.authUser._id
            });

            res.json({
                result:data,
                message:"Brand fetched!",
                meta:null
            })

        } catch (error) {
            next(error)            
        }
    }



    
    updateById = async (req,res,next)=>{
        try {
            // TOTO:Update Brand
            const brandId = req.params.id;
            await brandSvc.getById({
                _id:brandId,
                createdBy:req.authUser._id
            });

            // update operation
            const payload = brandSvc.transformEditRequest(req);
            const oldBrand = brandSvc.updateById(brandId,payload);

            if(payload.image){
                // delete Old image
                deleteFile("./public/uploads/brand/",oldBrand.image);
            }


            res.json({
                result:oldBrand,
                message:"Brand updated successfully!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }

    deleteById = async(req,res,next)=>{
        try {
            const brandId = req.params.id;
            await brandSvc.getById({
                _id:brandId,
                createdBy:req.authUser._id
            });

            let deleteBrand = await brandSvc.deleteById(brandId);

            if(deleteBrand.image){
                deleteFile('./public/uploads/brand/',deleteBrand.image);
            }

            res.json({
                result:deleteBrand,
                message:"Brand Deleted Successfully!",
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
                           {status: new RegExp(req.query['search'],'i')}
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
   
               let total = await brandSvc.countData(filter);
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

            const response = await brandSvc.listAllData(filter,{
                offset:skip,
                limit:limit
            },{
                sort:sort
            })

            res.json({
                result:response,
                message:"Brand fetched!",
                meta:{
                    page:page,
                    total:total,
                    limit:limit
                }
            })
        } catch (error) {
            next(error);            
        }
    }

    getDetailBySlug = async(req,res,next)=>{
        try {
            let brandDetail = await brandSvc.getById({
                slug:req.params.slug,
                status:"active"
            });

            // TODO: Product list
            res.json({
                result:{
                    detail:brandDetail,
                    product:nullable,
                },
                message:"brand Detail from Slug",
                meta:null
            })
        } catch (error) {
            next(error)            
        }
    }
}

const brandCtrl = new BrandController()
module.exports = brandCtrl
