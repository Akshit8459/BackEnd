const db=require('../Models/Users')
const bcrypt=require('bcryptjs');
const jwtUtil=require('../Utils/jwt')

//create user
exports.loginPage=(req,res)=>{
    try{
        const html=`
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

        <span style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: #444;
        ">
        <label style="margin: 0;">New User?</label>
        <button onclick="window.location.href='/users/register'"
            style="
            padding: 0.4rem 0.9rem;
            border: 1px solid #4f46e5;
            background-color: transparent;
            color: #4f46e5;
            border-radius: 0.6rem;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#4f46e5'; this.style.color='white';"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#4f46e5';"
        >
            Register
        </button>
        </span>
    </form>
    </body>
    </html>
        `
        return res.status(200).send(html);
    }
    catch(e){
        console.log("Error while viewing the login Page",e.message);
        return res.status(404).json({message:"Error while getting login page",error:e.message});
    }
}

exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await db.findOne({email:email});
        if(!user) return res.status(200).send("No user with such email was found. Please register or check details");
        const passwordHash=await bcrypt.compare(password,user.passwordHash);
        if(!passwordHash) return res.status(200).send("Wrong Password!");
        const userData={id:user._id,name:user.name,role:user.role};
        const token=await jwtUtil.generateToken(userData);
        res.cookie('authToken',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(200).send("User Logged In Successfully");
    }
    catch(e){
        console.log("Error while logging user in ",e);
        return res.status(404).json({message:"Error while logging user in",error:e});
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
                <form class="signup-container" action="/users/register" method="POST">
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
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPPORT">SUPPORT</option>
                    </select>

                    <button type="submit">Signup</button>

                    <span style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 1rem;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    color: #444;
                    ">
                    <label style="margin: 0;">Already a User?</label>
                    <button onclick="window.location.href='/users/login'"
                        style="
                        padding: 0.4rem 0.9rem;
                        border: 1px solid #4f46e5;
                        background-color: transparent;
                        color: #4f46e5;
                        border-radius: 0.6rem;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        "
                        onmouseover="this.style.backgroundColor='#4f46e5'; this.style.color='white';"
                        onmouseout="this.style.backgroundColor='transparent'; this.style.color='#4f46e5';"
                    >
                        Login
                    </button>
                    </span>
                </form>
                </body>
                </html>
                `
    res.send(html);
}

exports.registerUser=async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        const user=await db.find({email});
        if(user.length!=0) return res.status(400).send("User already exists");
        const passwordHash=await bcrypt.hashSync(password,10);
        const newUser=await db.create({name,email,passwordHash,role:role?role:'CUSTOMER'}) 
        return res.status(200).send("User Created Successfully");
    }
    catch(e){
        console.log("Error while viewing the registration Page",e.message);
        return res.status(404).json({message:"Error while getting registration page",error:e.message});
    }
}


//Read User
exports.getAllusers=async (req,res)=>{
    try{
        const users=await db.find({});
        if(!users || users.length==0) return res.send("No Users found");
        res.status(200).json(users);
    }catch(e){
        console.log("Can't fetch all users bcoz of:",e.message);
        return res.status(404).json({message:"Error while fetching all users",error:e.message});
    }
}

exports.getSingleUserbyId=async (req,res)=>{
    try{
        const {id}=req.params;
        const user=await db.findById(id);
        if(!user) return res.send("No User found");
        return res.status(200).json(user);
    }catch(e){
        console.log("Can't fetch user bcoz of:",e.message);
        return res.status(404).json({message:"Error while fetching user",error:e.message});
    }
}

//Update User
exports.updateUser=async (req,res)=>{
    try{
        const id=req.params.id;
        const {name,email,password,role}=req.body;
        let data={};
        if(name!=null) data.name=name;
        if(email!=null) data={...data,email};
        if(password!=null){
            const passwordHash=await bcrypt.hashSync(password,10);
            data={...data,passwordHash};
        }
        if(role!=null) data={...data,role};
        console.log(data);
        const user=await db.findByIdAndUpdate(id, {$set:data},{new:true});
        return res.status(200).json({message:"Updation Success",user:user});
    }catch(e){
        console.log("Can't Update the user:",e.message);
        return res.status(400).json({message:"Error while updating the user",error:e.message});
    }
}

//Delete User
exports.deleteUser=async (req,res)=>{
    try{
        const {id}=req.params;
        const user=await db.findOneAndDelete(id);
        if(!user) return res.send("No User Found");
        return res.status(200).json({message:"User Deleted Successfully",user:user});

    }catch(e){
        console.log("Can't delete the user:",e.message);
        return res.status(400).json({message:"Error while deleting the user",error:e.message});
    }
}

