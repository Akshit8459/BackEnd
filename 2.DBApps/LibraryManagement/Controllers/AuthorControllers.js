const author=require('../Schemas/AuthorSchema');

exports.getAllauthors=async (req,res)=>{
    try{
        const authorList=await author.find({}).populate("books");
        const items=authorList.map(auth=>{
            const bookTitles = auth.books.map(book => book.title).join(', ');
            return `<div style="padding:10px; margin:10px; border:1px solid #ccc; border-radius:8px;">
                    <ul>
                        <li><strong>Author Name:</strong> ${auth.author}</li>
                        <li><strong>Bio:</strong> ${auth.bio || "N/A"}</li>
                        <li><strong>Books:</strong> ${bookTitles || "No books yet"}</li>
                    </ul>
                </div>`
        }).join("");
         const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authors</title>
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
                <h1>All Authors</h1>
                ${items}
            </body>
            </html>
        `;
        res.setHeader("Content-Type","text/html");
        res.send(html);
    }
    catch(e){
        console.log(`error while getting authors info:${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.getAuthor= async (req,res)=>{
    try{
        const auth=await author.findById(req.params.id).populate('books');
        if(!auth)return res.send("Author Not Found");
        res.status(202).json(auth);
    }catch(e){
        console.log(`error while getting author detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.updateAuthor= async (req,res)=>{
    try{
        const previousData=await author.findById(req.params.id);
        const updatedData={
            author:req.body.author?? previousData.author,
            bio:req.body.bio?? previousData.bio,
            publishers:req.body.publishers?? previousData.publishers,
            books:req.body.books?? previousData.books
        };
        const auth=await author.findByIdAndUpdate(req.params.id,updatedData,{new:true});
        console.log(`Author Updated Successfully`);
        res.status(200).json({ message: "Author updated successfully", updatedAuthor: auth });
    }catch(e){
        console.log(`error while updating author detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.deleteAuthor= async (req,res)=>{
    try{
        const auth=await author.findByIdAndDelete(req.params.id);
        console.log("Author Deleted Successfully");
        res.status(200).send("Author Deleted Successfully");
    }catch(e){
        console.log(`error while deleting author detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.createAuthor= async (req,res)=>{
    try{
        const data=req.body;
        if(!data)return res.send("DATA NOT FOUND");
        const auth=await author.create(data);
        res.status(201).json({ message: "Author created successfully", created: auth });
    }catch(e){
        console.log(`error while creating author detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}