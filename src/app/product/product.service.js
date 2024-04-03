const { default: slugify } = require('slugify');
const ProductModel = require('./product.model');
const { generateRandomString } = require('../../config/helper');

class ProductService{

    // we can make this transformer logic to product.request.js also, make  class there and function
    transformCreateRequest = (request) =>{
        let data = {
            ... request.body
        }


        if(request.files){
            data.images = request.files.map((item)=> item.filename);
        }else{
            data.images = null;
        }

        if(data.category && data.category !== 'null'){
            data.category = data.category.split(",");
        }else{
            data.category = null;
        }

        if(!data.brand || data.brand === 'null'){
            data.brand = null;
        }
        if(!data.sellerId || data.sellerId === 'null'){
            data.sellerId = null;
        }

        data.afterDiscount = data.price - data.price * (data.discount/100);

        if(!request.file){
            data.image = null;
        }else{
            data.image = request.file.filename
        }

        // slug generate
        data.slug = slugify(request.body.title,{
            replacement:"-",
            lower:true
        });


         

        data.createdBy = request?.authUser?._id || null

        return data;
    }

    checkSlug = async(slug)=>{
        try {
            let count = await ProductModel.countDocuments({slug:slug})
            if(count>0){
                // make unique slug
                let random = generateRandomString(100)
                slug = slug+"-"+random;
                return await this.checkSlug(slug); // recursion until unique
            }else{
                return slug;
            }
        } catch (error) {
            throw error;            
        }
    }
    transformEditRequest = (request) =>{
        let data = {
            ... request.body
        }

        if(request.files){
            data.images = request.files.map((item)=> item.filename);
        }
        // ... 

        if(data.delImages){
            let images = data.images.filter((img)=> !data.delImage.indludes(img));
            data.images = images;
            // TODO: Delete images
        }

        if(data.category && data.category !== 'null'){
            data.category = payload.category.split(",");
        }
        if(!data.brand || data.brand === 'null'){
            data.brand = null;
        }
        if(!data.sellerId || data.sellerId === 'null'){
            data.sellerId = null;
        }

        data.afterDiscount = data.price - data.price * data.discount;

        
        if(request.file){
            data.image = request.file.filename
            // TODO: Delete ond image after update operation
        }

        return data;
    }

    storeProduct =async (req)=>{
        try {
            let product = new ProductModel(req)
            return await product.save()
        } catch (error) {
            // 11000
            throw error
            
        }
    }

    listAllData = async(filter ={},paging={offset:0,limit:15},options={sort:{_id:1}})=>{
        try {
            // fetch lists also populate createdBy data from users table
            let list = await ProductModel.find(filter)
                            .populate('createdBy',["_id", "name","email","role","image"])
                            .sort(options.sort)
                            .skip(paging.offset)
                            .limit(paging.limit)
            return list
        } catch (error) {
            throw exception
            
        }
    }


    countData = async (filter = {}) =>{
        try {
            let count = await ProductModel.count(filter);
            return count;
        } catch (error) {
            throw error
            
        }
    } 


    // getBySlugWithProduct = async (filter) =>{

    // } 
    // we'll use this func. after product is ready by aggregiating for now we're using getbyId

    getData = async(filter,paging={limit:15,skip:0},sort={_id:"DESC",title:"asc"})=>{
        try {
            // id => findById()
            const data = await ProductModel.findOne(filter)
            .populate('createdBy',["_id", "name"])
            .populate('category',['_id',"title","slug","status"])
            .populate('brand',['_id',"title","slug","status"])
            .populate('sellerId',['_id',"name"])
            .sort(sort)
            .skip(paging.skip)
            .limit(paging.limit)


            if(data){
                return data;
            }else{
                throw {code:404, message:"Product doesnot exist!"};
            }

        } catch (error) {
            throw error;            
        }
    }


    updateById = async(productId,payload)=>{
        try {
            let response = await ProductModel.findByIdAndUpdate(productId,{
                $set:payload
            })           

            return response;  
        } catch (error) {
            throw error            
        }
    }

    deleteById = async(productId)=>{
        try {
            let response = await ProductModel.findByIdAndDelete(productId);
            if(response){
                return response;
            }else{
                throw({code:404,message:"Product already deleted or does not exists!"})
            }
        } catch (error) {
            throw error;
        }
    }
}


const productSvc = new ProductService()
module.exports = productSvc