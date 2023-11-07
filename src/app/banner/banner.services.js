class BannerService{

    transformCreateRequest = (request) =>{
        let data = {
            ... request.body
        }

        if(!request.file){
            throw{code:400,message:"Image is required",result:}
        }else{
            data.image = req.file.filename
        }

        data.createdBy = req.authUser._id

        return data;
    }

}


const bannerSvc = new BannerService()
module.exports = bannerSvc