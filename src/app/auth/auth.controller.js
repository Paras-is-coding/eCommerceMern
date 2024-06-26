const { generateRandomString, getTokenFromHeader } = require("../../config/helper.js");
const authSvc = require("./auth.services.js");
const mailSvc = require("../../services/mail.service.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const AuthRequest = require("./auth.request.js");
// const { MongoClient } = require("mongodb");
dotenv.config();
// const {dbSvc} = require('../../services/db.service.js');

class authController {
  register = async (req, res, next) => {
    try {
      // payload modification moved to auth.request.js transformer
      let payload = new AuthRequest(req).transformRequestData();

      //TODO: dbase store
      // const response = await dbSvc.db.collection('users').insertOne(payload);
      const response = await authSvc.registerUser(payload);

      const mailMsg = authSvc.registerEmailMessage(payload.name, payload.token);
      await mailSvc.emailSend(payload.email, "Activate your account!", mailMsg);

      res.json({
        result: response,
        message: "User registered successfully!",
        meta: null,
      });
      next();
    } catch (except) {
      next(except);
    }
  };

  verifyToken = async (req, res, next) => {
    try {
      let token = req.params.token;

      //Todo DB query to validate token
      // let userdetails = await dbSvc.db.collection('users').findOne({token:token})
      const userdetails = await authSvc.getUserByFilter({ token: token });

      if (userdetails) {
        res.json({
          result: userdetails,
          message: "Valid token!",
          meta: null,
        });
      } else {
        next({ code: 400, message: "Invalid or Expired token" });
      }
    } catch (except) {
      next(except);
    }
  };

   setPassword = async (req, res, next) => {
    try {
      let data = req.body;
      console.log(data);

      let token = req.params.token;
      //password,confirmPassword
      //TODO : DB Update
      //status : active
      //token : null
      const userdetails = await authSvc.getUserByFilter({ token: token });

      if (userdetails) {
        let encPass = bcrypt.hashSync(data.password, 10);
        const updateData = {
          password: encPass,
          token: null,
          status: "active",
        };

        let updateResponse = await authSvc.updateUser(
          { _id: userdetails._id },
          updateData
        );

        res.json({
          result: updateResponse,
          message: "User Activated Successfully!",
          meta: null,
        });
      } else {
        next({
          code: 400,
          message: "Invalid token/expired token/broken",
          result: data,
        });
      }
    } catch (except) {
      next(except);
    }
  };

  login = async (req, res, next) => {
    try {
      let payload = req.body;

      // TODO : fetch user from db using email if exist
      let userDetail = await authSvc.getUserByFilter({
        email: payload.email,
      });

      if (userDetail) {
        if (userDetail.token === null && userDetail.status === "active") {
          if (bcrypt.compareSync(payload.password, userDetail.password)) {
            // user is logged in
            // Create JWT
            let token = jwt.sign(
              { userId: userDetail._id },
              process.env.JWT_SECRETKEY,
              { expiresIn: "2h" }
            );
            let refreshToken = jwt.sign(
              { userId: userDetail._id },
              process.env.JWT_SECRETKEY,
              { expiresIn: "1d" }
            );

            // TODO : Store loggedin token in seperate DB table
            let patData = {
              userId: userDetail._id,
              token: token,
              refreshToken: refreshToken
            }
            await authSvc.storePAT(patData);

            res.json({
              token: token,
              refreshToken: refreshToken,
              type: "Bearer", // just to identify token
            });
          } else {
            next({ code: 400, message: "Credential doesnot match!" });
          }
        } else {
          next({
            code: 401,
            message: "User not activated. Check email for activation!",
          });
        }
      } else {
        next({ code: 400, message: "User does not exist!" });
      }
    } catch (except) {
      next(except);
    }
  };



  forgetPassword = async (req, res, next) => {
    try {

      // Fetch userDetails using email from DB
      let userDetail = await authSvc.getUserByFilter({
        email: req.body.email,
      });

      if (userDetail.status === 'active') {

        // resetToken and resetExpiry to userDetails
        let resetToken = generateRandomString();
        let resetExpiry = Date.now() + 86400000;
        let updateData = {
          resetToken,
          resetExpiry
        }
        let response = await authSvc.updateUser({ email: req.body.email }, updateData);

        // Send resetToken to mail we received
        let mailMsg = authSvc.forgotPasswordMessage("User", resetToken);
        const mailAck = await mailSvc.emailSend(
          req.body.email,
          "Activate your account!",
          mailMsg
        );
        console.log(mailAck);

        // response 
        res.json({
          result: null,
          message: "Check your email to confirm your email!",
          meta: null,
        });

      } else {
        next({ code: 400, message: "User is not activated!" })
      }

    } catch (error) {
      next(error)

    }

  };





  resetPassword = async (req, res, next) => {
    try {


      let resetToken = req.params.resetToken;
      let password = req.body.password;

      // fetch user using resetToken DB, check exists & expired
      let userDetails = await authSvc.getUserByFilter({ resetToken })


      if (!userDetails) {
        throw ({ code: 400, message: "Invalid token!" })
      } else {
        // DB resetExpiry, string format -> 2023-10-13T09:00:00:000(Z if UTC is set)
        let date = userDetails.resetExpiry;
        // so extract timestamp = new Date(userDetails.resetEspiry).getTime(); 
        let timestamp = new Date(date).getTime();
        // todaysTime = Date.now();
        let todaysTime = Date.now();

        if (todaysTime > timestamp) {
          throw { code: 400, message: "Token Expired" }
        } else {
          const updateData = {
            password: bcrypt.hashSync(password, 10),
            resetToken: null,
            resetExpiry: null
          }

          let response = await authSvc.updateUser({
            resetToken
          }, updateData);

          // success response send
          res.json({
            result: null,
            message: "Password reset successfully. Login to continue!",
            meta: null
          });

        }
      }


    } catch (error) {
      next(error)

    }

  }



  
  refreshToken = async (req,res,next)=>{
    try {
      
          // Create JWT
          let newToken = jwt.sign(
            { userId: req.authUser._id },
            process.env.JWT_SECRETKEY,
            { expiresIn: "2h" }
          );

          // update the user's token
          await authSvc.updateUser({_id:req.authUser._id},{token:newToken})
         

          // Store newToken in database pats table
          const patUser = await authSvc.getPatById(req.authUser._id);
          let patData = {
            userId: req.authUser._id,
            token: newToken,
            refreshToken: patUser.refreshToken
            
          }
          await authSvc.storePAT(patData);


          // respond with the new token and relevant info
          res.json({
            token: newToken,
            refreshToken: patUser.refreshToken,
            type: "Bearer", // just to identify token
          }); 
    } catch (error) {
      next(error)
      
    } 
  }





  getLoggedInUser = (req, res, next) => {
    res.json({ authUser: req.authUser });
  };

  logoutUser = async (req, res, next) => {
    try {
      let token = getTokenFromHeader(req);
      //TODO: complete logout
      let loggedout = await authSvc.deletePatData(token);
      res.json({
        result: null,
        message: "Logged out successfully!",
        meta: null
      })
    } catch (error) {
      next(error)
    }
  };


}

const authCtrl = new authController();
module.exports = authCtrl;
