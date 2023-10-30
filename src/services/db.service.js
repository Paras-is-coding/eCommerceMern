const { MongoClient } = require("mongodb");
require('dotenv').config();

class DatabaseService{
    client;
    db;
    constructor(){
        this.connect();
    }

    connect = async()=>{
        try {
            this.client = await MongoClient.connect(process.env.MONGODB_URL);
            this.db = this.client.db(process.env.MONGODB_NAME);
        } catch (error) {
            throw error;
        }
    }
}

const dbSvc = new DatabaseService();
module.exports = {dbSvc,DatabaseService};