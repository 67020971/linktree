const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;
let db;

async function connectDB(){

  if(!db){
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("linktree");
    console.log("MongoDB connected");
  }

  return db;
}

module.exports = connectDB;