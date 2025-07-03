const db =require('../Models/user')
const bcrypt=require('bcryptjs')
const saltRounds=10;
const jwtUtils=require('../Utils/jwt')

exports.getAllUsers=async (req,res)=>{
    try{
        const users=await db.find({});
        if(!users || users.length==0) return res.status(200).send("No users Created yet")
        res.status(200).json(users)
    }catch(e){
        return res.status(400).json({message:"Error while Fetching all users:",error:e.message})
    }
}

exports.getSingleUser=async (req,res)=>{
    try{
        const user=await db.findById(req.params.id)
        if(!user) return res.status(200).send("No such user Created yet")
        res.status(200).json(user)
    }catch(e){
        return res.status(400).json({message:"Error while Fetching a user:",error:e.message})
    }
}

exports.deleteUser=async (req,res)=>{
    try{
        const user=await db.findByIdAndDelete(req.params.id)
        if(!user) return res.status(200).send("No such user Created yet")
        res.status(200).json({user:user,message:"User Deleted Successfully"})
    }catch(e){
        return res.status(400).json({message:"Error while Deleting a user:",error:e.message})
    }
}

exports.updateUser=async (req,res)=>{
    try{
        const data=req.body
        if(!data) return res.status(400).send("Send Data to be updated for the user")
        const user=await db.findByIdAndUpdate(req.params.id,req.body)
        if(!user) return res.status(200).send("No such user Created yet")
        res.status(200).json({user:user,message:"User Updated Successfully"})   
    }catch(e){
        return res.status(400).json({message:"Error while Updating a user:",error:e.message})
    }
}

exports.createUser=async (req,res)=>{
    try{
        const {name,email,password,role}=req.body
        const passwordHash=await bcrypt.hash(password,saltRounds);
        const data={name,email,passwordHash,role:role??"NORMAL"}
        if(!data) return res.status(400).send("Send Data to be updated for the user")
        const user=await db.create(data)
        res.status(200).json({user:user,message:"User Created Successfully"})   
    }catch(e){
        return res.status(400).json({message:"Error while Creating a user:",error:e.message})
    }
}

exports.loginPage=async (req,res)=>{
    const loginPage=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
        background: #f0f4f8;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        }
        .login-container {
        background: #fff;
        padding: 32px 28px;
        border-radius: 10px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        width: 320px;
        }
        h2 {
        text-align: center;
        margin-bottom: 24px;
        color: #333;
        }
        label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #333;
        }
        input {
        width: 100%;
        padding: 10px;
        margin-bottom: 18px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
        }
        button {
        width: 100%;
        padding: 12px;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.2s;
        }
        button:hover {
        background: #0056b3;
        }
    </style>
    </head>
    <body>
    <form class="login-container" action="/users/login" method="POST">
        <h2>Login</h2>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Login</button>
    </form>
    </body>
    </html>
    `
    res.send(loginPage)
}

exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await db.findOne({email:email})
        if(!user) return res.send("No such user was found")
        const passwordHash=await bcrypt.compare(password,user.passwordHash)
        if(!passwordHash) return res.send("Wrong Password for the user")
        const token=await jwtUtils.generateToken({id:user._id,name:user.name,email:user.email,role:user.role})
        res.cookie("authToken",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.redirect('/');
    }catch(e){
        res.status(200).json({message:"Error while logging in:",error:e.message})
    }
}



exports.signupPage=async (req,res)=>{
    const html=`<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Signup</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                    background: #f0f4f8;
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    }
                    .signup-container {
                    background: #fff;
                    padding: 32px 28px;
                    border-radius: 10px;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
                    width: 320px;
                    }
                    h2 {
                    text-align: center;
                    margin-bottom: 24px;
                    color: #333;
                    }
                    label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #333;
                    }
                    input, select {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 18px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    }
                    button {
                    width: 100%;
                    padding: 12px;
                    background: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    }
                    button:hover {
                    background: #0056b3;
                    }
                </style>
                </head>
                <body>
                <form class="signup-container" action="/users/signup" method="POST">
                    <h2>Signup</h2>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required />

                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required />

                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required />

                    <label for="role">Role</label>
                    <select id="role" name="role" required>
                    <option value="">Select Role</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="ADMIN">ADMIN</option>
                    </select>

                    <button type="submit">Signup</button>
                </form>
                </body>
                </html>
                `
    res.send(html);
}