const mongoose=require('mongoose')

const authorSchema=new mongoose.Schema({
    author:{type:String,required:true},
    bio:{type:String},
    publishers:[{type:mongoose.Schema.Types.ObjectId,ref:'Publisher'}],
    books:[{type:mongoose.Schema.Types.ObjectId,ref:'Book'}]
});

module.exports=mongoose.model("Author",authorSchema);