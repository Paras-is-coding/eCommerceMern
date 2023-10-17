const {generateRandomString} = require("../../config/helper.js");
const authSvc = require('./auth.services.js');
const mailSvc = require("../../services/mail.service.js");

class authController {
    register = async (req,res,next) =>{
           try{
            const {password,...rest} = req.body;
            const payload = rest;
            if(req.file){
                payload.image = req.file.filename;
            }
            if(req.files){
                payload.image = req.files.map((file)=>{
                    return file.filename;
                })
            }

            payload.status = "active";
            payload.token = generateRandomString();

            //TODO: dbase store 

            const mailMsg = authSvc.registerEmailMessage(payload.name,payload.token);
            const mailAck = await mailSvc.emailSend(payload.email,"Activate your account!",mailMsg);
            
            res.json(payload);
            next();
            
           }catch(except){
            next(except)
           }
    }

    verifyToken = (req,res,next)=>{
        try{
            let token = req.params.token;
            //Todo DB query to validate token 
            if(token){
                res.json({
                    result:{},
                    message:"Valid token!",
                    meta:null
                })
            }
            else{
                next({code:400,message:"Invalid of Expired token"})
            }

        }catch(except){
            next(except)
        }
    }

    setPassword = (req,res,next)=>{}

    login = (req,res,next)=>{}
}

const authCtrl = new authController();
module.exports = authCtrl;