const express=require('express');
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
app.use(express.json());

const Users=require("./Schemas/UserSchema.js");

mongoose.connect(process.env.URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("Connected Successfully to Mongo Server"))
.catch(err=>console.log("Error connecting to DB",err));

app.get("/",(req,res)=>{
    res.send("WORKING SERVER");
})


//to get all users
app.get("/about",async (req,res)=>{
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    const users=await Users.find({});
    const userLogger=users.map(user=>{
        return `<li>${user.name} is ${user.age} year old and holds id: ${user.id}</li>`
    }).join("")
    res.send(`<html>
        <head>
        <meta http-equiv="refresh" content="5">
        <title>MONGO SERVER</title>
        </head>
        <body>
        <h1> ALL USERS:</h1>
        <ul>
        ${userLogger}
        </ul></body></html>`);
})

//to add users
app.post("/about",async (req,res)=>{
    const user=req.body;
    const result = await Users.aggregate([
    { $group: { _id: null, maxId: { $max: "$id" } } }
    ]);
    const maxId = result[0]?.maxId || 0;
    user.id=req.body.id || maxId+1 ;
    try{
        await Users.create(user);
        res.send(`user created successfully ${JSON.stringify(user)}`);
    }catch(e){
        console.log(`error while user creation: ${e}`);
        res.send({
            message:"ERROR WHILE USER CREATION",
            error:e.message,
        })
    }
})

//to update a user


// to delete a user

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})