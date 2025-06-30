const express=require('express');
const app=express();
app.use(express.json());
require('dotenv').config();
const connector=require('./DBConnect.js');
const routes=require('./Routes/TodoRoutes.js');

(async ()=>{
    try{
        await connector();
        app.use('/tasks',routes);
        app.get("/",(req,res)=>{
            const homepage=`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Todo App - Home</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: #f4f4f4;
                        display: flex;
                        height: 100vh;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        margin-bottom: 20px;
                    }
                    button {
                        padding: 12px 24px;
                        font-size: 16px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }
                    button:hover {
                        background: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to the Todo App</h1>
                    <button onclick="window.location.href='localhost:8080/tasks'">View Tasks</button>
                </div>
            </body>
            </html>
            `
            res.setHeader('Content-Type', 'text/html');
            res.send(homepage);
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`The server is running successfully on PORT:${process.env.PORT}`);
        });
    }catch(e){
        console.log(`error during server intialization:${e}`);
    }
})();
