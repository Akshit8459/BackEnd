const express=require('express')
const app=express();
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());


const connectDb=require('./Database/mongoconnect')

connectDb();

const userRoutes=require('./Routes/UserRoutes')
const productRoutes=require('./Routes/ProductRoutes')

app.use('/api/users/', userRoutes);
app.use('/api/products/', productRoutes);

app.get('/',(req,res)=>{
    res.send("HOMEPAGE")
})
app.listen(process.env.PORT,()=>{
    console.log("app running on port:", process.env.PORT);
})