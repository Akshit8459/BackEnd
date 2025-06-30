const mongoose=require('mongoose')

const booksSchema=new mongoose.Schema({
    title:{type:String,required:true},
    pages:{type:Number,required:true},
    genre:{type:String},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"Author"},
    publisher:{type:mongoose.Schema.Types.ObjectId,ref:'Publisher'},
    publishedDate:{type:Date,required:true}
});

module.exports=mongoose.model("Book",booksSchema);