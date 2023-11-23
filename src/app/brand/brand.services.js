const { default: slugify } = require("slugify")
const BrandModel = require("./brand.model")

class BrandService{

    transformCreateRequest = (request) =>{
        let data = {
            ... request.body
        }

        if(!request.file){
            throw{code:400,message:"Image is required",result:data}
        }else{
            data.image = request.file.filename
        }

         // slug generate
         data.slug = slugify(request.body.title,{
            replacement:"-",
            lower:true
        });

        data.createdBy = request.authUser._id

        return data;
    }

    transformEditRequest = (request) =>{
        let data = {
            ... request.body
        }

        
        if(request.file){
            data.image = request.file.filename
            // TODO: Delete ond image after update operation
        }

        return data;
    }


    storeBrand =async (req)=>{
        try {
            let brand = new BrandModel(req)
            return await brand.save()
        } catch (error) {
            throw error
            
        }
    }

    listAllData = async(filter={},paging={offset:0,limit:15})=>{
        try {
            // fetch lists also populate createdBy data from users table
            let list = await BrandModel.find(filter)
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
            let count = await BrandModel.count(filter);
            return count;
        } catch (error) {
            throw error
            
        }
    } 

    getById = async(filter)=>{
        try {
            const data = await BrandModel.findOne(filter)
            .populate('createdBy',["_id", "name","email","role","image"]);

            if(data){
                return data;
            }else{
                throw {code:404, message:"Brand doesnot exist!"};
            }

        } catch (error) {
            throw error;            
        }
    }


    updateById = async(brandId,payload)=>{
        try {
            let response = await BrandModel.findByIdAndUpdate(brandId,{
                $set:payload
            })           

            return response;  
        } catch (error) {
            throw error            
        }
    }

    deleteById = async(brandId)=>{
        try {
            let response = await BrandModel.findByIdAndDelete(brandId);
            if(response){
                return response;
            }else{
                throw({code:404,message:"Brand already deleted or does not exists!"})
            }
        } catch (error) {
            throw error;
        }
    }

}


const brandSvc = new BrandService()
module.exports = brandSvc