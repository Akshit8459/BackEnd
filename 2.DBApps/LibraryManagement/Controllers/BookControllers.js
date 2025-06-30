const book=require('../Schemas/BookSchema');

exports.getAllBooks=async (req,res)=>{
    try{
        const bookList=await book.find({}).populate("author").populate("publisher");
        const items=bookList.map(b=>{
            return `<div style="padding:10px; margin:10px; border:1px solid #ccc; border-radius:8px;">
                    <ul>
                        <li><strong>Book:</strong> ${b.title}</li>
                        <li><strong>Genre:</strong> ${b.genre || "N/A"}</li>
                        <li><strong>Pages:</strong> ${b.pages}</li>
                        <li><strong>Author:</strong> ${b.author?.author || "N/A"}</li>
                        <li><strong>Publisher:</strong> ${b.publisher?.publisher || "N/A"}</li>
                        <li><strong>Published Date:</strong> ${new Date(b.publishedDate).toDateString()}</li>
                    </ul>
                </div>`
        }).join("");
         const html = `
           <!DOCTYPE html>
            <html>
            <head>
                <title>Books</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        background: #f9f9f9;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <h1>All Books</h1>
                ${items}
            </body>
            </html>`;
        res.setHeader("Content-Type","text/html");
        res.send(html);
    }
    catch(e){
        console.log(`error while getting Books info:${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.getBook= async (req,res)=>{
    try{
        const b=await book.findById(req.params.id).populate('author').populate('publisher');
        if(!b)return res.send("Book Not Found");
        res.status(200).json(b);
    }catch(e){
        console.log(`error while getting book detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.updateBook= async (req,res)=>{
    try{
        const previousData=await book.findById(req.params.id);
        const updatedData={
            title:req.body.title?? previousData.title,
            pages:req.body.pages?? previousData.pages,
            genre:req.body.genre?? previousData.genre,
            author:req.body.author?? previousData.author,
            publisher:req.body.publisher?? previousData.publisher,
            publishedDate:req.body.publishedDate?? previousData.publishedDate
        };
        const b=await book.findByIdAndUpdate(req.params.id,updatedData,{new:true});
        console.log(`Book Updated Successfully`);
        res.status(200).json({ message: "Book updated successfully", updatedBook: b });
    }catch(e){
        console.log(`error while updating book detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.deleteBook= async (req,res)=>{
    try{
        const b=await book.findByIdAndDelete(req.params.id);
        if (!b) return res.status(404).send("Book not found");
        console.log("Book Deleted Successfully");
        res.status(200).send("Book Deleted Successfully");
    }catch(e){
        console.log(`error while deleting Book detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.createBook= async (req,res)=>{
    try{
        const data=req.body;
        if(!data)return res.send("DATA NOT FOUND");
        const b=await book.create(data);
        res.status(201).json({ message: "Book created successfully", created: b });
    }catch(e){
        console.log(`error while creating book detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}