const mongoose=require('mongoose')
require('dotenv').config();
const connect=()=>{mongoose.connect(process.env.URL)
.then(console.log("Connected to database successfully"))
.catch(e=>{console.log(`error while connecting to database:${err}`)});
};
module.exports=connect;