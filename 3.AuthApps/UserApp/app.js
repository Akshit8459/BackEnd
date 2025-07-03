const express=require('express')
const app=express();

app.use(express.json())
app.use(express.urlencoded())

const cookieParser=require('cookie-parser')
app.use(cookieParser())


const connect=require('./Database/connectdb')
connect.connector();

//routes
app.get('/',(req,res)=>{
    res.send(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Homepage</title>
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
            h1 {
            color: #333;
            margin-bottom: 40px;
            }
            .button-group {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 220px;
            }
            .btn {
            padding: 15px 0;
            font-size: 1.1rem;
            border: none;
            border-radius: 8px;
            background: #007bff;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
            text-align: center;
            text-decoration: none;
            }
            .btn:hover {
            background: #0056b3;
            }
        </style>
        </head>
        <body>
        <h1>Welcome to the Homepage</h1>
        <div class="button-group">
            <a href="/users/login" class="btn">Login</a>
            <a href="/users/signup" class="btn">Signup</a>
            <a href="/users/" class="btn">View Users</a>
        </div>
        </body>
        </html>`
    )
})


const userRoutes=require('./Routes/userRoutes')
app.use('/users',userRoutes)

app.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log("Server running at port:",process.env.PORT)
})
