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
            // let response = await this.db.collection('users').insertOne(payload);
            return response;
        } catch (except) {
            throw except;            
        }
    }

    getUserByFilter = async (filter)=>{
        try {
            // let userdetails = await this.db.collection('users').findOne(filter);
            return userdetails;
        } catch (except) {
            throw except;
            
        }
    }

    updateUser = async (filter,data)=>{
        try {
            // const response = await this.db.collection('users').updateOne(filter,{
            //     $set:data
            // })
            return response;
        } catch (except) {
            throw except;            
        }
    }

}

const authSvc = new AuthService()

module.exports = authSvc;