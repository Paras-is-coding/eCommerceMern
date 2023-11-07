const bannerSvc = require("./banner.service")

class BannerController{
    bannerCreate = (req,res,next)=>{
        try {
            // DB operation  

            // collect all input data, move code to services
            let data = bannerSvc.transformCreateRequest(req);
            
        } catch (error) {
            next(error)
            
        }
    }
}

const bannerCtrl = new BannerController()
module.exports = bannerCtrl
