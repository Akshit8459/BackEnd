const mongoose=require('mongoose');
require('dotenv').config();

const connectDB=async()=>{
    mongoose.connect(process.env.URL)
    .then(()=>console.log('MongoDB connected successfully'))
    .catch(err=>console.error('MongoDB connection failed:', err));
}

module.exports=connectDB;