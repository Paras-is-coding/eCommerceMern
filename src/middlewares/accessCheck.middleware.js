const accessCheck = (svc) =>{
    return async (req,res,next) =>{
        try {
            let id = req.params.id;

            let data = svc.getById(id);
            if(!data){
                next({code:400,message:"Content doesnot exists!"})
            }

            if(data.createdBy._id === req.authUser._id){
                req.content = data;
                next();
            }else{
                next({code:400,message:"Content doesnot belongs to you!"})
            }

        } catch (error) {
            next(error);
        }
    }
}

module.exports = {accessCheck}