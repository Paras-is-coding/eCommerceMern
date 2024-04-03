const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize.config.js'); // Import your Sequelize connection instance

const UserModel = sequelize.define('User', {
    id:{
        type:DataTypes.BIGINT,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50] // Mongoose min:2, max:50
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'inactive'
    },
    image: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('admin', 'seller', 'customer'),
        defaultValue: 'customer'
    },
    phone: {
        type: DataTypes.STRING
    },
    token: {
        type: DataTypes.STRING
    },
    resetToken: {
        type: DataTypes.STRING
    },
    resetExpiry: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true, // Mongoose timestamps: true
    createdAt: 'createdAt', // Mongoose createdAt
    updatedAt: 'updatedAt', // Mongoose updatedAt
});

module.exports = UserModel;
