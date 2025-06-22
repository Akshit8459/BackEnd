const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{type:String},
    age:{type:Number},
    id:{type:Number},
});

const Users=mongoose.model('users',UserSchema);

module.exports=Users;