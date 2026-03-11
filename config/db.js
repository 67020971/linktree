const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectDB(){
    await client.connect();
    return client.db("users");
}

module.exports = connectDB;