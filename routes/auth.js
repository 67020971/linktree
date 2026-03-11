const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const multer = require("multer");
const { ObjectId } = require("mongodb");

const router = express.Router();

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({

destination: function (req, file, cb) {
cb(null, "uploads/")
},

filename: function (req, file, cb) {

const ext = file.originalname.split(".").pop()

cb(null, Date.now() + "." + ext)

}

})

const upload = multer({ storage })

/* =========================
   REGISTER
========================= */

router.post("/register", async (req,res)=>{

const {username,password} = req.body;

try{

const db = await connectDB();
const users = db.collection("users");

const existing = await users.findOne({username})

if(existing){
return res.json({
success:false,
message:"Username already exists"
})
}

const hashed = await bcrypt.hash(password,saltRounds);

await users.insertOne({
username,
password:hashed,
avatar:null
});

res.json({
success:true,
message:"Register successful"
});

}catch(err){

console.log("REGISTER ERROR:", err)

res.json({
success:false,
message:"Register failed"
});

}

});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req,res)=>{

const {username,password} = req.body;

try{

const db = await connectDB();
const users = db.collection("users");

const user = await users.findOne({username});

if(!user){
return res.json({
success:false,
message:"User not found"
});
}

const match = await bcrypt.compare(password,user.password);

if(match){

res.json({
success:true,
message:"Login successful"
});

}else{

res.json({
success:false,
message:"Wrong password"
});

}

}catch(err){

res.json({
success:false,
message:"Login failed"
});

}

});

/* =========================
   UPLOAD AVATAR
========================= */

router.post("/upload-avatar",upload.single("avatar"),async(req,res)=>{

try{

const db = await connectDB()

await db.collection("users").updateOne(
{username:req.body.username},
{$set:{avatar:req.file.filename}}
)

res.json({success:true})

}catch(err){

res.json({success:false})

}

})

/* =========================
   ADD LINK
========================= */

router.post("/add-link", async (req,res)=>{

const {username,title,url} = req.body

if(!username || !title || !url){
return res.json({
success:false,
message:"Missing data"
})
}

try{

const db = await connectDB()

await db.collection("links").insertOne({
username,
title,
url,
views:0,
order:Date.now()
})

res.json({
success:true,
message:"Link added"
})

}catch(err){

res.json({
success:false,
message:"Add link failed"
})

}

})

/* =========================
   GET LINKS
========================= */

router.get("/links/:username", async (req,res)=>{

const username = req.params.username

try{

const db = await connectDB()

const links = await db
.collection("links")
.find({username})
.sort({order:1})
.toArray()

res.json(links)

}catch(err){

res.json([])

}

})

/* =========================
   DELETE LINK
========================= */

router.delete("/delete-link/:id", async (req,res)=>{

try{

const db = await connectDB()

await db.collection("links").deleteOne({
_id:new ObjectId(req.params.id)
})

res.json({success:true})

}catch(err){

res.json({success:false})

}

})

/* =========================
   EDIT LINK
========================= */

router.put("/edit-link/:id", async (req,res)=>{

const { title,url } = req.body

try{

const db = await connectDB()

await db.collection("links").updateOne(
{ _id:new ObjectId(req.params.id) },
{ $set:{ title,url } }
)

res.json({success:true})

}catch(err){

res.json({success:false})

}

})

/* =========================
   SORT LINKS
========================= */

router.post("/sort-links", async (req,res)=>{

const { links } = req.body

try{

const db = await connectDB()

const collection = db.collection("links")

for(let i=0;i<links.length;i++){

await collection.updateOne(
{ _id:new ObjectId(links[i]) },
{ $set:{ order:i } }
)

}

res.json({success:true})

}catch(err){

res.json({success:false})

}

})

/* =========================
   VIEW LINK
========================= */

router.post("/view/:id", async (req,res)=>{

try{

const db = await connectDB()

await db.collection("links").updateOne(
{_id:new ObjectId(req.params.id)},
{$inc:{views:1}}
)

res.json({success:true})

}catch(err){

res.json({success:false})

}

})

/* =========================
   GET USER
========================= */

router.get("/user/:username", async (req,res)=>{

try{

const db = await connectDB()

const user = await db.collection("users").findOne({
username:req.params.username
})

res.json(user)

}catch(err){

res.json(null)

}

})

module.exports = router