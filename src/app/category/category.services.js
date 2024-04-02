const { default: slugify } = require("slugify")
const CategoryModel = require("./category.model")

class CategoryService{

    transformCreateRequest = (request) =>{
        let data = {
            ... request.body
        }

        if(!request.file){
            data.image = null
        }else{
            data.image = request.file.filename
        }

         // slug generate
         data.slug = slugify(request.body.title,{
            replacement:"-",
            lower:true
        });

        data.createdBy = request.authUser._id
        data.parentId = (!request.body.parentId || request.body.parentId === 'null')?null:request.body.parentId;

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


    storeCategory =async (req)=>{
        try {
            let category = new CategoryModel(req)
            return await category.save()
        } catch (error) {
            throw error
            
        }
    }

    listAllData = async(filter={},paging={offset:0,limit:15},options={sort:{_id:1}})=>{
        try {
            // fetch lists also populate createdBy data from users table
            let list = await CategoryModel.find(filter)
                            .populate('createdBy',["_id", "name","email","role","image"])
                            .populate('parentId',['_id',"name","slug","image","createdBy","parentId"])
                            .sort(options.sort)
                            .skip(paging.offset)
                            .limit(paging.limit)

            return list
        } catch (error) {
            throw error
            
        }
    }


    countData = async (filter = {}) =>{
        try {
            let count = await CategoryModel.count(filter);
            return count;
        } catch (error) {
            throw error
            
        }
    } 

    // getBySlugWithProduct = async (filter) =>{

    // } 
    // we'll use this func. after product is ready by aggregiating for now we're using getbyId

    getById = async(filter)=>{
        try {
            const data = await CategoryModel.findOne(filter)
            .populate('createdBy',["_id", "name","email","role","image"])
            .populate('parentId',['_id',"name","slug","image","createdBy","parentId"]);


            if(data){
                return data;
            }else{
                throw {code:404, message:"Category doesnot exist!"};
            }

        } catch (error) {
            throw error;            
        }
    }


    updateById = async(categoryId,payload)=>{
        try {
            let response = await CategoryModel.findByIdAndUpdate(categoryId,{
                $set:payload
            })           

            return response;  
        } catch (error) {
            throw error            
        }
    }

    deleteById = async(categoryId)=>{
        try {
            let response = await CategoryModel.findByIdAndDelete(categoryId);
            if(response){
                return response;
            }else{
                throw({code:404,message:"Category already deleted or does not exists!"})
            }
        } catch (error) {
            throw error;
        }
    }

}


const categorySvc = new CategoryService()
module.exports = categorySvc