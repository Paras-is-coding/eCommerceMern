const { deleteFile } = require('../../config/helper.js');
const productSvc = require('../product/product.service.js');
const categorySvc = require('./category.services.js')

class CategoryController{
    categoryCreate = async (req,res,next)=>{
        try {
            // checkLogin
            // permission check
            // file upload 
            // validation payload
            // transform req


            // DB operation  

            // collect all input data, move code to services

            let payload = categorySvc.transformCreateRequest(req);

             // to not update image if null or undefined
             if(!payload.image || payload.image === ''){
                delete payload.image;
            }
            
            // create category
            let created = await categorySvc.storeCategory(payload);

            res.json({
                result:created,
                message:"Category created successfully!",  
                meta:null
            })
            
        } catch (error) {
            next(error)
            
        }
    }


    
    listAllCategories = async (req,res,next)=>{
        try {
            //handle search,sort,paginate
            // search
            let filter={}

            if(req.query['search']){
                filter = {
                    // search keyword on title,status
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
 
             let total = await categorySvc.countData(filter);
             // total=100, 7 page
             // 1st =>0-14, 2nd=>15-29 ...
             let skip = (page-1)*limit;

            let list = await categorySvc.listAllData(filter,{offset:skip,limit:limit});
            res.json({
                result:list,
                message:"Category fetched successfully!",
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
            const data = await categorySvc.getById({
                _id:id,
                createdBy:req.authUser._id
            });

            res.json({
                result:data,
                message:"Category fetched!",
                meta:null
            })

        } catch (error) {
            next(error)            
        }
    }



    
    updateById = async (req,res,next)=>{
        try {
            // TOTO:Update Category
            const categoryId = req.params.id;
            // await categorySvc.getById({
            //     _id:categoryId,
            //     createdBy:req.authUser._id
            // });

            // update operation
            const payload = categorySvc.transformEditRequest(req);

            if(!payload.image || payload.image === ''){
                delete payload.image;
            }

            const oldCategory = categorySvc.updateById(categoryId,payload);

            if(payload.image){
                // delete Old image
                deleteFile("./public/uploads/category/",oldCategory.image);
            }


            res.json({
                result:oldCategory,
                message:"Category updated successfully!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }

    deleteById = async(req,res,next)=>{
        try {
            const categoryId = req.params.id;
            await categorySvc.getById({
                _id:categoryId,
                createdBy:req.authUser._id
            });

            let deleteCategory = await categorySvc.deleteById(categoryId);

            if(deleteCategory.image){
                deleteFile('./public/uploads/category/',deleteCategory.image);
            }

            res.json({
                result:deleteCategory,
                message:"Category Deleted Successfully!",
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
   
               let total = await categorySvc.countData(filter);
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

            const response = await categorySvc.listAllData(filter,{
                offset:skip,
                limit:limit
            },{
                sort:sort
            })

            res.json({
                result:response,
                message:"Category fetched!",
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
            let categoryDetail = await categorySvc.getById({
                slug:req.params.slug,
                status:"active"
            });
            console.log(typeof(categoryDetail))

            // TODO: Product list
            let productFilter = [
                {category:{$in:[categoryDetail._id],$nin:null}},
                {status:"active"}
            ]

            // search ko lagi filter edit
            if(req.query.search){
                productFilter = {
                    $and:[
                        ...productFilter,
                        {$or:[
                            {title:new RegExp(req.query.search,'i')},
                            {summary:new RegExp(req.query.search,'i')},
                            {description:new RegExp(req.query.search,'i')},
                        ]}
                    ]
                }
            }else{
                productFilter = {
                    $and:[
                        ...productFilter
                    ]
                }
            }
            //...

            
            // sorting ko lagi 
            let sort = {_id:"DESC",title:"asc"}
            if(req.query.sort){
                // key and direction
                // ?sort=price,asc/desc  
                let sortSplit = req.query.sort.split(','); //["price","asc"]
                sort = {[sortSplit[0]]:sortSplit[1]}

            }

            const total = await productSvc.countData(productFilter);
            const limit = +req.query.limit || 10;
            const page = +req.query.page || 1;
            const skip = (page-1) * limit;
            const products = await productSvc.getData(productFilter,{limit,skip},sort);


            res.json({
                result:{
                    detail:categoryDetail,
                    product:products,
                },
                message:"category Detail from Slug",
                meta:{
                    page:page,
                    total:total,
                    limit:limit
                }
            })
        } catch (error) {
            console.log(error)
            next(error)            
        }
    }
}

const categoryCtrl = new CategoryController()
module.exports = categoryCtrl
