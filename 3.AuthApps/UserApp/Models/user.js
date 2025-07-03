const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true},
    role:{type:String,enum:["ADMIN","NORMAL"],required:true,trim:true,default:"NORMAL"},
    passwordHash:{type:String,required:true}
})

module.exports=mongoose.model("user",userSchema)