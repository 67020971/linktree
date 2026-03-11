const express = require('express');
const bodyParsser = require('body-parser');
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const multer = require("multer")
const PORT = process.env.PORT || 3000
const cors = require("cors");

dotenv.config();

const uri =  process.env.MONGO_URI
const saltRounds = process.env.SALT_ROUNDS;

const app = express();

app.use(cors({
  origin: "https://linktree-rust-ten.vercel.app"
}));


app.use(bodyParsser.json());
app.use(express.static("public"));
app.use("/api", authRoutes);
app.use("/uploads", express.static("uploads"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/:username", async (req, res) => {

    const username = req.params.username;

    const client = new MongoClient(uri);

    try {

        await client.connect();

        const db = client.db("users");

        const links = await db
            .collection("links")
            .find({ username: username })
            .toArray();

        let html = `<h1>${username}</h1>`;

        links.forEach(link => {
            html += `<p>
                        <a href="${link.url}" target="_blank">
                            ${link.title}
                        </a>
                    </p>`;
        });

        res.send(html);

    } catch (error) {

        res.send("User not found");

    } finally {

        await client.close();

    }

});
//test connect
app.get("/api/test-db", async (req, res) => {

try{

const connectDB = require("./config/db");

const db = await connectDB();

await db.command({ ping: 1 });

res.json({
success:true,
message:"MongoDB connected"
});

}catch(err){

console.log("DB TEST ERROR:",err)

res.json({
success:false,
message:"MongoDB connection failed",
error:err.message
});

}

});


app.listen(PORT, () =>{
console.log("Server running on port " + PORT)
})