const mongoose=require('mongoose')
require('dotenv').config()

exports.connector=()=>{
    mongoose.connect(process.env.URL).then(console.log("Connected To Database"))
    .catch(e=>{console.log("Error while connecting to DB:",e.message)})
}