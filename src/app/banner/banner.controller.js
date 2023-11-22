const { deleteFile } = require('../../config/helper.js');
const bannerSvc = require('./banner.services.js')

class BannerController{
    bannerCreate = async (req,res,next)=>{
        try {
            // DB operation  

            // collect all input data, move code to services
            let payload = bannerSvc.transformCreateRequest(req);

            
            // create banner
            let created = await bannerSvc.storeBanner(payload);

            res.json({
                result:created,
                message:"Banner created successfully!",  
                meta:null
            })
            
        } catch (error) {
            next(error)
            
        }
    }


    
    listAllBanners = async (req,res,next)=>{
        try {
            //handle search,sort,paginate
            // search
            let filter={}

            if(req.query['search']){
                filter = {
                    // search keyword on title, url, status
                    $or:[
                        {title: new RegExp(req.query['search'],'i')},
                        {url: new RegExp(req.query['search'],'i')},
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
 
             let total = await bannerSvc.countData(filter);
             // total=100, 7 page
             // 1st =>0-14, 2nd=>15-29 ...
             let skip = (page-1)*limit;

            let list = await bannerSvc.listAllData(filter,{offset:skip,limit:limit});
            res.json({
                result:list,
                message:"Banner fetched successfully!",
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
            const data = await bannerSvc.getById({
                id:id,
                createdBy:req.authUser._id
            });

            res.json({
                result:data,
                message:"Banner fetched!",
                meta:null
            })

        } catch (error) {
            next(error)            
        }
    }



    
    updateById = async (req,res,next)=>{
        try {
            // TOTO:Update Banner
            const bannerId = req.params.id;
            await bannerSvc.getById({
                _id:bannerId,
                createdBy:req.authUser._id
            });

            // update operation
            const payload = bannerSvc.transformEditRequest(req);
            const oldBanner = bannerSvc.updateById(bannerId,payload);

            if(payload.image){
                // delete Old image
                deleteFile("./public/uploads/banner/",oldBanner.image);
            }


            res.json({
                result:oldBanner,
                message:"Banner updated successfully!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }

    deleteById = async(req,res,next)=>{
        try {
            const bannerId = req.params.id;
            await bannerSvc.getById({
                _id:bannerId,
                createdBy:req.authUser._id
            });

            let deleteBanner = await bannerSvc.deleteById(bannerId);

            if(deleteBanner.image){
                deleteFile('./public/uploads/banner/',deleteBanner.image);
            }

            res.json({
                result:deleteBanner,
                message:"Banner Deleted Successfully!",
                meta:null
            })

        } catch (error) {
            next(error);            
        }
    }


    listHome = async (req,res,next)=>{
        try {
            const response = await bannerSvc.listAllData({
                status:"active",
                // startDate:{$lte:new Date()},
                // endDate:{$gte:new Date()}
            },{
                offset:0,
                limit:10
            })

            res.json({
                result:response,
                message:"Banner fetched!",
                meta:null
            })
        } catch (error) {
            next(error);            
        }
    }
}

const bannerCtrl = new BannerController()
module.exports = bannerCtrl
