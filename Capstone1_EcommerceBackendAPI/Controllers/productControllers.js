const db=require('../Models/Products');

exports.getAllProducts=async (req,res)=>{
    try{
        const products=await db.find();
        if(!products || products.length==0) return res.status(200).json({message:"No Products were found"});
        res.status(200).json(products);
    }catch(e){
        console.log("Error while fetching products",e.message);
        return res.status(400).json({message:"Error while fetching products",error:e.message});
    }
}

exports.getSingleProductById=async (req,res)=>{
    try{
        const id=req.params.id;
        const product=await db.findById(id);
        if(!product) return res.json({message:"No such Product Was Found"});
        return res.status(200).json(product);
    }catch(e){
        console.log("Error while fetching products",e.message);
        return res.status(400).json({message:"Error while fetching products",error:e.message});
    }
}


exports.createProduct=async (req,res)=>{
    try{
        const {name,description,price,category,stock,images}= req.body;
        const data={name,description,price,category,stock,images};
        const product = await db.create(data);
        if(!product) return res.json({message:"Error while creating this product"});
        return res.status(200).json(product);
    }catch(e){
        console.log("Error while adding product",e.message);
        return res.status(400).json({message:"Error while adding product",error:e.message});
    }
}

exports.updateProduct=async (req,res)=>{
    try{
        const id=req.params.id;
        const {name,description,price,category,stock,images}=req.body;
        let data={};
        if(name!=null) data.name=name;
        if(description!=null) data={...data,description};
        if(price!=null) data={...data,price};
        if(category!=null) data.category=category;
        if(stock!=null) data.stock=stock;
        if(images!=null) data.images=images;
        data.updatedAt=Date.now();
        console.log(data);
        const product=await db.findByIdAndUpdate(id, {$set:data},{new:true});
        return res.status(200).json({message:"Updation Success",product:product});
    }catch(e){
        console.log("Can't Update the user:",e.message);
        return res.status(400).json({message:"Error while updating the product",error:e.message});
    }
}


exports.deleteProduct=async (req,res)=>{
    try{
        const id=req.params.id;
        const product=await db.findByIdAndDelete(id);
        if(!product) return res.status(400).send("Product with this id doesn't exist");
        return res.status(200).json({message:"Product Deleted Successfully",product:product})
    }
    catch(e){
        console.log("Error while deleting the product",e.message);
        return res.status(404).json({message:"Error while deleting the product",error:e.message});
    }
}