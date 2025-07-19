const db=require('../Models/Orders')

exports.getAllOrders=async (req,res)=>{
    try{
        const orders=await db.find({}).populate("user", "id name email").populate('orderItems.product', "id name price category stock");
        if(!orders ||orders.length==0) return res.status(200).send("No orders Exists yet")
        return res.status(200).json(orders);
    }catch(e){
        console.log("Error while fetching orders",e.message);
        return res.status(400).json({message:"error while fetching all orders",error:e.message});
    }
}

exports.getSingleOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const order=await db.findById(id).populate("user", "id name email").populate('orderItems.product', "id name price category stock");
        if(!order) return res.status(200).send("No Such order Exists yet")
        return res.status(200).json(order);
    }catch(e){
        console.log("Error while fetching order",e.message);
        return res.status(400).json({message:"error while fetching order",error:e.message});
    }
}

exports.deleteOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const order=await db.findByIdAndDelete(id)
        if(!order) return res.status(200).send("No Such order Exists yet")
        return res.status(200).json({message:"Order Deleted Successfully",order});
    }catch(e){
        console.log("Error while deleting order",e.message);
        return res.status(400).json({message:"error while deleting order",error:e.message});
    }
}

exports.createOrder=async (req,res)=>{
    try{
        const {user,product,quantity,price,status,totalAmount,paymentId,shippingAddress,placedAt,updatedAt}=req.body;
        const orderData = {
            user,
            orderItems: [{
                product,
                quantity,
                price
            }],
            totalAmount,
            shippingAddress
        };
        // Optional fields
        if (status) orderData.status = status;
        if (paymentId) orderData.paymentId = paymentId;
        if (placedAt) orderData.placedAt = placedAt;
        if (updatedAt) orderData.updatedAt = updatedAt;

        const order=await db.create(orderData);
        if(!order) return res.status(200).send("Error while creating this order")
        return res.status(200).json({message:"Order created Successfully",order});
    }catch(e){
        console.log("Error while creating order",e.message);
        return res.status(400).json({message:"error while creating order",error:e.message});
    }
}

exports.updateOrder=async (req,res)=>{
    try{
        const id=req.params.id;
        const {user,product,quantity,price,status,totalAmount,paymentId,shippingAddress,placedAt,updatedAt}=req.body;
        if(user) data.user=user;
        let items={};
        if(product) items.product=product;
        if(quantity) items.quantity=quantity;
        if(price) items.price=price;
        const orderItems=[items];
        let data={};
        data.orderItems=orderItems;
        if(totalAmount) data.totalAmount=totalAmount;
        if(shippingAddress) data.shippingAddress=shippingAddress;
        if (status) orderData.status = status;
        if (paymentId) orderData.paymentId = paymentId;
        if (updatedAt) orderData.updatedAt = Date.now();
        
        const order=await db.findByIdAndUpdate(id,{$set:data},{new:true});
        if(!order) return res.status(200).send("Error while updating this order")
        return res.status(200).json({message:"Order updated Successfully",order});
    }catch(e){
        console.log("Error while updating order",e.message);
        return res.status(400).json({message:"error while updating order",error:e.message});
    }
}