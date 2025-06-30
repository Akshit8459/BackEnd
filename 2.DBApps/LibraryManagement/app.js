const express=require('express');
const app=express();
require('dotenv').config();
const authRoutes=require("./Routes/AuthorRoutes");
const bookRoutes=require("./Routes/BookRoutes");
const publisherRoutes=require('./Routes/PublisherRoutes');

const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

app.use(helmet());
//app.use(mongoSanitize());

app.use(express.json());
app.use('/authors',authRoutes);
app.use('/books',bookRoutes);
app.use('/publishers',publisherRoutes);

const homepage=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Library Management System</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        header {
            background-color: #2f3e46;
            width: 100%;
            padding: 20px 0;
            color: #fff;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        header h1 {
            margin: 0;
            font-size: 2.5em;
        }

        .container {
            margin-top: 60px;
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            padding: 30px 40px;
            text-align: center;
            width: 250px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        }

        .card h2 {
            font-size: 1.6em;
            margin-bottom: 15px;
            color: #2f3e46;
        }

        .card a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2f3e46;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }

        .card a:hover {
            background-color: #3f5661;
        }

        footer {
            margin-top: 100px;
            padding: 20px;
            color: #777;
            font-size: 0.9em;
        }
    </style>
</head>
<body>

    <header>
        <h1>Welcome to the Library Management System</h1>
    </header>

    <div class="container">
        <div class="card">
            <h2>View All Authors</h2>
            <a href="/authors">Go to Authors</a>
        </div>
        <div class="card">
            <h2>View All Books</h2>
            <a href="/books">Go to Books</a>
        </div>
        <div class="card">
            <h2>View All Publishers</h2>
            <a href="/publishers">Go to Publishers</a>
        </div>
    </div>

    <footer>
        &copy; 2025 Library Management System | Designed by You
    </footer>

</body>
</html>
`
app.get('/',(req,res)=>{
    res.setHeader("Content-Type","text/html");
    res.send(homepage);
    res.end();
})

const connect=require('./DBConnect');
async function connector(){
    try{
        await connect();
    }catch(e){console.log(e.message)}
}
connector();


app.listen(process.env.PORT,()=>{
    console.log(`app running on port:${process.env.PORT}`);
});