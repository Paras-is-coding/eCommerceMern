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

    listAllData = async(filter={},paging={offset:0,limit:15})=>{
        try {
            // fetch lists also populate createdBy data from users table
            let list = await BannerModel.find(filter)
                            .populate('createdBy',["_id", "name","email","role","image"])
                            .sort({_id:1})
                            .skip(paging.offset)
                            .limit(paging.limit)

            return list
        } catch (error) {
            throw error
            
        }
    }


    countData = async (filter = {}) =>{
        try {
            let count = await BannerModel.count(filter);
            return count;
        } catch (error) {
            throw error
            
        }
    } 

    getById = async(filter)=>{
        try {
            const data = await BannerModel.findOne(filter)
            .populate('createdBy',["_id", "name","email","role","image"]);

            if(data){
                return data;
            }else{
                throw {code:404, message:"Banner doesnot exist!"};
            }

        } catch (error) {
            throw error;            
        }
    }

}


const bannerSvc = new BannerService()
module.exports = bannerSvc