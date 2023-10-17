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

    verifyToken = (req,res,next)=>{}

    setPassword = (req,res,next)=>{}

    login = (req,res,next)=>{}
}

const authCtrl = new authController();
module.exports = authCtrl;