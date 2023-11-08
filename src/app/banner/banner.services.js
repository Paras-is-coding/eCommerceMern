const BannerModel = require("./banner.model")

class BannerService{

    transformCreateRequest = (request) =>{
        let data = {
            ... request.body
        }

        if(!request.file){
            throw{code:400,message:"Image is required",result:data}
        }else{
            data.image = request.file.filename
        }

        data.createdBy = request.authUser._id

        return data;
    }


    storeBanner =async (req)=>{
        try {
            let banner = new BannerModel(req)
            return await banner.save()
        } catch (error) {
            throw error
            
        }
    }

    listAllData = async()=>{
        try {
            // fetch lists also populate createdBy data from users table
            let list = await BannerModel.find()
                            .populate('createdBy',["_id", "name","email","role","image"]);

            return list
        } catch (error) {
            throw exception
            
        }
    }

}


const bannerSvc = new BannerService()
module.exports = bannerSvc