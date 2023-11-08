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
}

const bannerCtrl = new BannerController()
module.exports = bannerCtrl
