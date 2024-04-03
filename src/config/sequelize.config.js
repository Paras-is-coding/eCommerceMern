const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'postgres', '5815', {
    host: 'localhost',
    port: 5432,
    dialect: "postgres"
  });


  const testConnection = async () =>{
    try {
        await sequelize.authenticate()
        console.log("Postgres server connected...")
    } catch (error) {
        console.log("Postgres server connection error!")
    }
  }

  testConnection()

  module.exports = sequelize