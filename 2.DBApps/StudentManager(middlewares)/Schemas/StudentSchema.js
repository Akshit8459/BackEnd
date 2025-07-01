const mongoose=require('mongoose')

const studentSchema=new mongoose.Schema({
    name:{type:String,required:true},
    age:Number,
    email:{type:String,required:true},
    phoneNumber:String
});

module.exports=mongoose.model("student",studentSchema);