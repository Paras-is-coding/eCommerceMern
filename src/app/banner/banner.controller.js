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
}

const bannerCtrl = new BannerController()
module.exports = bannerCtrl
