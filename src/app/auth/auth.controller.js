const {generateRandomString} = require("../../config/helper.js");
const authSvc = require('./auth.services.js');
const mailSvc = require("../../services/mail.service.js");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
// const { MongoClient } = require("mongodb");
dotenv.config();
// const {dbSvc} = require('../../services/db.service.js');

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
            // const response = await dbSvc.db.collection('users').insertOne(payload);
            const response = await authSvc.registerUser(payload);

            const mailMsg = authSvc.registerEmailMessage(payload.name,payload.token);
            await mailSvc.emailSend(payload.email,"Activate your account!",mailMsg);
            
            res.json({
                result:response,
                message:"User registered successfully!",
                meta:null
            });
            next();
            
           }catch(except){
            next(except)
           }
    }

    verifyToken = async (req,res,next)=>{
        try{
            let token = req.params.token;

            //Todo DB query to validate token
            // let userdetails = await dbSvc.db.collection('users').findOne({token:token})
            const userdetails = await authSvc.getUserByFilter({token:token});

            if(userdetails){
                res.json({
                    result:userdetails,
                    message:"Valid token!",
                    meta:null
                })
            }
            else{
                next({code:400,message:"Invalid or Expired token"})
            }

        }catch(except){
            next(except)
        }
    }

    setPassword = async (req,res,next)=>{
        try{
            let data = req.body;
            console.log(data);

            let token = req.params.token
            //password,confirmPassword
            //TODO : DB Update
            //status : active 
            //token : null
            const userdetails = await authSvc.getUserByFilter({token:token});

            if(userdetails){
                let encPass = bcrypt.hashSync(data.password,10);
                const updateData = {
                    password:encPass,
                    token:null,
                    status:"active",
                }

                let updateResponse = await authSvc.updateUser({_id:userdetails._id},updateData)


            res.json({
                result:updateResponse,
                message:"User Activated Successfully!",
                meta:null
            })
            }else{
                next({code:400,message:"Invalid token/expired token/broken",result:data})
            }

        }catch(except){
            next(except)
        }
    }



    login = (req,res,next)=>{
      try{
        let payload = req.body;
          // TODO : fetch user from db using email if exist
        // db data comes like this : test for now
        let userDetail = {
            _id:"dsdfdsf",
            name:"Paras Chand",
            email:"paras@gmail.com",
            role:"admin",
            status:"active",
            token:null,
            password:"$2a$10$uIRiOdwQ1WzcredUzy.WPegxpY70FfgbqklUNZ0tQ5xwJuV7SEnu."
        }
        
        if(bcrypt.compareSync(payload.password,userDetail.password )){
            // user is logged in 
            // Create JWT 
            let token = jwt.sign({userId : userDetail._id},process.env.JWT_SECRETKEY,{expiresIn:"2h"});
            let refreshToken = jwt.sign({userId : userDetail._id},process.env.JWT_SECRETKEY,{expiresIn:"1d"}) 

            res.json({
                token:token,
                refreshToken:refreshToken,
                type:"Bearer" // just to identify token
            })
        } else{
            next({code:400,message:"Credential doesnot match!"});
        }

      }catch(except){
        next(except)
      }

    }

    getLoggedInUser = (req,res,next)=>{
        res.json({authUser : req.authUser})
    }


}

const authCtrl = new authController();
module.exports = authCtrl;