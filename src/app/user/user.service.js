const UserModel = require("./user.model");

class UserService {
    createUser = async (userData) => {
        try {
          const newUser = new UserModel(userData);
          await newUser.save();
          return newUser.toObject();
        } catch (error) {
          throw error;
        }
      };


  getFilter = (filter, query) => {
    if (query.search) {
      filter = {
        ...filter,
        $or: [
          { name: new RegExp(query.search, "i") },
          { email: new RegExp(query.search, "i") },
        ],
      };
    }

    let page = +query.page || 1;
    let limit = +query.limit || 10;

    let pagination = {
      page: page,
      limit: limit,
      skip: (page - 1) * limit,
    };

    return { filter, pagination };
  };

  getCount = async (filter) => {
    try {
      let count = await UserModel.countDocuments(filter);
      return count;
    } catch (e) {
      throw e;
    }
  };

  getAllDataByFilter = async (filter, { skip = 0, limit = 10 }) => {
    try {
      let data = await UserModel.find(filter).select("-password").skip(skip).limit(limit);

     
      return data;
    } catch (e) {
      throw e;
    }
  };

  getUserById = async (id) => {
    try {
      let data = await UserModel.findById(id);

      // removing password field
      if (data.toObject) {
        data = data.toObject();
      }
      delete data.password;

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateUserById = async (id, newData) => {
    try {
      // Find the user by ID and update the fields
      let updatedUser = await UserModel.findByIdAndUpdate(id, newData, {
        new: true,
      });

      // If user is not found
      if (!updatedUser) {
        throw new Error("User not found");
      }

      // Remove sensitive fields like password before sending response
      if (updatedUser.toObject) {
        updatedUser = updatedUser.toObject();
      }
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  deleteUserById = async (id) => {
    try {
      // Find the user by ID and delete
      const deletedUser = await UserModel.findByIdAndDelete(id);

      // If user is not found
      if (!deletedUser) {
        throw new Error("User not found");
      }

      return deletedUser;
    } catch (error) {
      throw error;
    }
  };
}

const userSvc = new UserService();
module.exports = userSvc;
