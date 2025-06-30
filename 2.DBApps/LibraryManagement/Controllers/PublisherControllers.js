const publisher=require('../Schemas/PublisherSchema.js');

exports.getAllPublishers=async (req,res)=>{
    try{
        const publisherList=await publisher.find({}).populate("books");
        const items=publisherList.map(publ=>{
            const books = publ.books?.map(b => b.title).join(", ") || "No books yet";
            return `<div style="padding:10px; margin:10px; border:1px solid #ccc; border-radius:8px;">
                        <ul>
                            <li><strong>Publisher:</strong> ${publ.publisher}</li>
                            <li><strong>Location:</strong> ${publ.location || "N/A"}</li>
                            <li><strong>Established:</strong> ${new Date(publ.established).toDateString()}</li>
                            <li><strong>Books:</strong> ${books || "No books yet"}</li>
                        </ul>
                    </div>`
        }).join("");
         const html = `
           <!DOCTYPE html>
            <html>
            <head>
                <title>Publishers</title>
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
                <h1>All Publishers</h1>
                ${items}
            </body></html>`;
        res.setHeader("Content-Type","text/html");
        res.send(html);
    }
    catch(e){
        console.log(`error while getting Publisher info:${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.getPublisher= async (req,res)=>{
    try{
        const publ=await publisher.findById(req.params.id).populate('books');
        if(!publ)return res.send("Publisher Not Found");
        res.status(200).json(publ);
    }catch(e){
        console.log(`error while getting Publisher detail: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.updatePublisher= async (req,res)=>{
    try{
        const previousData=await publisher.findById(req.params.id);
        const updatedData={
            publisher:req.body.publisher?? previousData.publisher,
            location:req.body.location?? previousData.location,
            established:req.body.established?? previousData.established,
            books:req.body.books?? previousData.books
        };
        const publ=await publisher.findByIdAndUpdate(req.params.id,updatedData,{new:true});
        console.log(`Publisher Updated Successfully`);
        res.status(200).json({ message: "Publisher updated successfully", updatedPublisher: publ });
    }catch(e){
        console.log(`error while updating Publisher: ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.deletePublisher= async (req,res)=>{
    try{
        const publ=await publisher.findByIdAndDelete(req.params.id);
        if (!publ) return res.status(404).send("Publisher not found");
        console.log("Publisher Deleted Successfully");
        res.status(200).send("Publisher Deleted Successfully");
    }catch(e){
        console.log(`error while deleting Publisher : ${e.message}`);
        res.status(404).send(e.message);
    }
}

exports.createPublisher= async (req,res)=>{
    try{
        const data=req.body;
        if(!data)return res.send("DATA NOT FOUND");
        const publ=await publisher.create(data);
        res.status(201).json({ message: "Publisher created successfully", created: publ });
    }catch(e){
        console.log(`error while creating Publisher: ${e.message}`);
        res.status(404).send(e.message);
    }
}