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

            let list = await bannerSvc.listAllData(filter);
            res.json({
                result:list,
                message:"Banner fetched successfully!",
                meta:null
            })
        } catch (error) {
            next(error)
            
        }
    }
}

const bannerCtrl = new BannerController()
module.exports = bannerCtrl
