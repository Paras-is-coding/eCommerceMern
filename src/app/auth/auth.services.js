const UserModel = require('../user/user.model.js');
const PATModel = require('./personal-access-token.js');
require("dotenv").config()

class AuthService{
    registerEmailMessage(name, token) {
        // TODO: DB table msg
        return `
                    <b>Dear ${name}</b><br/>
                    <p>Your account has been successfully registerd. Please copy or click the link below to activate your account: </p>
                    <a href="${process.env.FRONTEND_URL}/activate/${token}">
                        ${process.env.FRONTEND_URL}/activate/${token}
                    </a><br/>
                    <p>
                        <b>Regards</b>
                    </p>
                    <p>
                        <b>System Admin</b>
                    </p>
                    <p>
                        <em><small>Please do not reply to this email.</small></em>
                    </p>
                `
    }

    registerUser = async(payload)=>{
        try {
             // {key:value} in payload will map to UserModel {key:value} with same key
             let user = new UserModel(payload)
             let response = await user.save();
            return response;
        } catch (except) {
            throw except;            
        }
    }

    getUserByFilter = async (filter)=>{
        try {
            let userdetails = await UserModel.findOne(filter)
            return userdetails;
        } catch (except) {
            throw except;
            
        }
    }

    storePAT = async (data) =>{
        try {
            let patObj = new PATModel(data);
            return await patObj.save();
        } catch (error) {
            throw error           
        }
    }

    getPatByToken = async (token) =>{
        try {
            let patData = await PATModel.findOne({
                token:token
            })
            return patData;
        } catch (error) {
            throw error;
            
        }
    }


    updateUser = async (filter,data)=>{
        try {
            let response = await UserModel.updateOne(filter,{
                $set:data
            })
            return response;
        } catch (except) {
            throw except;            
        }
    }

}

const authSvc = new AuthService()

module.exports = authSvc;