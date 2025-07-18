const mongoose=require('mongoose');

const connect=function (){
    mongoose.connect(process.env.DB_URL)
    .then(console.log("Connected to MongoDB Successfully"))
    .catch(e=>console.log("Error while connecting to mongo DB:",e));
};

module.exports=connect;

