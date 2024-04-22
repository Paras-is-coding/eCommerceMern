const userSvc = require("./user.service");

class UserController{
    createUserByAdmin = async (req, res, next) => {
        try {
            let data = {
                ... req.body
            }
    
            if(!req.file){
                data.image = null
            }else{
                data.image = req.file.filename
            }
            if(!data.image || data.image === ''){
                delete data.image;
            }

            const newUser = await userSvc.createUser(data);
            res.json({
                result: newUser,
                message: "User created successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    listAllUsers = async (req, res, next) => {
        try {
            const { filter, pagination } = userSvc.getFilter({}, req.query);
            const count = await userSvc.getCount(filter);
            const data = await userSvc.getAllDataByFilter(filter, { skip: pagination.skip, limit: pagination.limit });

            res.json({
                result: data,
                message: "All users listed successfully!",
                meta: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total: count
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getUserByStatus=async(req,res,next)=>{
        try{
            let status = req.params.status;
            const {filter,pagination} = userSvc.getFilter({status:status},req.query);
            let count = await userSvc.getCount(filter);
            let data = await userSvc.getAllDataByFilter(filter,{skip:pagination.skip,limit:pagination.limit});

            res.json({
                result:data,
                message:"User Listed By status",
                meta:{
                    page:pagination.page,
                    limit:pagination.limit,
                    total:count
                }
            })
        }catch(e){
            next(e);
        }
    }

    getUserByRole=async(req,res,next)=>{
        try{
            let role = req.params.role;
           
            const {filter,pagination} = userSvc.getFilter({role:role},req.query);
            let count = await userSvc.getCount(filter);
            let data = await userSvc.getAllDataByFilter(filter,{skip:pagination.skip,limit:pagination.limit});

            res.json({
                result:data,
                message:"User Listed By status",
                meta:{
                    page:pagination.page,
                    limit:pagination.limit,
                    total:count
                }
            })
        }catch(e){
            next(e);
        }

    }

    getDataById = async(req,res,next)=>{
        try {
            const {id} = req.params;
            
            const data = await userSvc.getUserById(id);

            res.json({
                result:data,
                message:"User fetched!",
                meta:null
            })

        } catch (error) {
            next(error)            
        }
    }


    updateById = async (req, res, next) => {
        try {
            const { id } = req.params;

            let data = {
                ... req.body
            }
    
            if(!req.file){
                data.image = null
            }else{
                data.image = req.file.filename
            }
            if(!data.image || data.image === ''){
                delete data.image;
            }

            const updatedUser = await userSvc.updateUserById(id, data);
            res.json({
                result: updatedUser,
                message: "User updated successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    deleteById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedUser =  await userSvc.deleteUserById(id);
            res.json({
                result: deletedUser,
                message: "User deleted successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }


   


    
}


const userCtrl = new UserController()
module.exports = userCtrl;