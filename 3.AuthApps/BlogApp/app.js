const express=require('express');
const app=express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded());

const cookieParser=require('cookie-parser')
app.use(cookieParser());

//connect to database
const connect=require('./Database/connector')
connect();

//ejs setup
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

//routes
app.get('/',(req,res)=>{res.render("Homepage");})

const userRoutes=require('./Routes/userRoutes');
app.use('/users',userRoutes);

const blogRoutes=require('./Routes/blogRoutes')
app.use('/blogs',blogRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server listening on port:${process.env.PORT}`)
});