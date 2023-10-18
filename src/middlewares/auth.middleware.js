const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const checkLogin = (req, res, next) =>{
    try{
        // token verify here
        let token = null;

        if(req.query['token']){
            token = req.query['token'];
        }
        if(req.headers['x-xsrf-token']){
            token = req.headers['x-xsrf-token'];
        }
        if(req.headers['authorization']){
            token = req.headers['authorization'];
        }

        // token => null / "Bearer token" / "token"
        if(token === null){
            next({code:401, message:"Login required!"})
        }else{
            // token => "Bearer token" / "token"
            // "Bearer token" = ["Bearer","token"]
            // "token" = ["token"]
            token = token.split(" ").pop();
            if(!token){
                // token => "Bearer "
                next({code:401,message:"Token required!"})
            }else{
                // token = "token"
                let data = jwt.verify(token,process.env.JWT_SECRETKEY)
                //data yo hunxa {userId:"",iat:"",exp:""}
                //TODO verify payload > here userId is payload 
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
        if(userDetail){
            req.authUser = userDetail; // sometimes in next midd. we may need this data
            next();
        }else{
            next({code:401,message:"User does not exist anymore"})
        }

            }
        }

    }catch(except){
        console.log(except)
        next({code:401,message:"Authentication failed!",result:except.message})
    }
}

module.exports = checkLogin;