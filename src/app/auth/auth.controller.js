class authController {
    register = (req,res,next) =>{
           try{
            const {password,...rest} = req.body;
            if(req.file){
                rest.image = req.file.filename;
            }
            if(req.files){
                rest.image = req.files.map((file)=>{
                    return file.filename;
                })
            }
            
            res.json(rest);
            next();
           }catch(except){
            next(except)
           }
    }

    verifyToken = (req,res,next)=>{}

    setPassword = (req,res,next)=>{}

    login = (req,res,next)=>{}
}

const authCtrl = new authController();
module.exports = authCtrl;