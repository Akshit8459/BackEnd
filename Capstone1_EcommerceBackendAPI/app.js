//libraries import
const express=require('express')
const app=express();
require('dotenv').config();

//middlewares
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));



//connection to DB
const connectToMongo=require('./Database/connector');
connectToMongo();

//Defined Routes

const userRoutes=require('./Routes/userRoutes')
app.use('/users',userRoutes);

const productRoutes=require('./Routes/productRoutes');
app.use('/products',productRoutes);

const orderRoutes=require('./Routes/orderRoutes')
app.use('/orders',orderRoutes);

const paymentRoutes=require('./Routes/paymentRoutes')
app.use('/payments',paymentRoutes);

app.get('/',(req,res)=>{
    res.send("HOMEPAGE");
})


//Server Initialization
app.listen(process.env.PORT,()=>{
    console.log("Server running on PORT:",process.env.PORT);
})