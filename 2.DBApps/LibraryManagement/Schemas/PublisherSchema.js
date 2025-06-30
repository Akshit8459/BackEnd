const mongoose=require('mongoose')

const publisherSchema=new mongoose.Schema({
    publisher:{type:String,required:true},
    books:[{type:mongoose.Schema.Types.ObjectId,ref:'Book'}],
    location:{type:String,required:true},
    established:{type:Date,required:true}
});

module.exports=mongoose.model("Publisher",publisherSchema);