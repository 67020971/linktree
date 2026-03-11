const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

let client;
let db;

async function connectDB(){

if(!db){

client = new MongoClient(uri);

await client.connect();

db = client.db("users");

console.log("MongoDB connected");

}

return db;

}

module.exports = connectDB;