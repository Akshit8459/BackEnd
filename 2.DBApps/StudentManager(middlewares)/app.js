const express=require('express');
const app=express();
require('dotenv').config();

//rate limiter middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use('/', limiter);


app.use(express.json());
app.use(express.urlencoded());

//ejs config
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//

const connect=require('./Database/DBConnect');
connect();

const logger=require('./Middlewares/logger');
app.use(logger);
const studentRouter=require('./Routes/StudentRoutes');
app.use('/student',studentRouter);

app.get('/',(req,res)=>{
    res.render("homepage")
})

app.listen(process.env.PORT,()=>{
    console.log("Server running on PORT:",process.env.PORT);
})