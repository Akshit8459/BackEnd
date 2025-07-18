const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true},
    role:{type:String,enum:["ADMIN","CUSTOMER","SUPPORT"],required:true,trim:true,default:"CUSTOMER"},
    passwordHash:{type:String,required:true}
})

module.exports=mongoose.model('User',userSchema);