const sequelize = require("../../config/sequelize.config");
const UserModel = require("./user.model")

class UserSvc{
    createUser = async(data)=>{
        const userObj = new UserModel(data);
        const createdUser = await userObj.save();
    }
    getUserById = async(id)=>{
        const user = await UserModel.findByPk(id);
        // or
        const oneUser = await UserModel.findOne({
            where:{
                id:id
            }
        })
        //or
        const data = await sequelize.query("SELECT * FROM users WHERE id = :id",{id:id})
    }
}