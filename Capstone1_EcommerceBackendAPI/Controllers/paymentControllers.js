const db=require("../Models/Payment")

exports.getAllPayments=async (req,res)=>{
    try{
        const payments=await db.find({}).populate("userId", "id name email").populate('orderId', "id name price category stock");
        if(!payments ||payments.length==0) return res.status(200).send("No payment Exists yet")
        return res.status(200).json(payments);
    }catch(e){
        console.log("Error while fetching payments",e.message);
        return res.status(400).json({message:"error while payments all orders",error:e.message});
    }
}

exports.getSinglePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const payment=await db.findById(id).populate("userId", "id name email").populate('orderId', "id name price category stock");
        if(!payment) return res.status(200).send("No Such payment Exists yet")
        return res.status(200).json(payment);
    }catch(e){
        console.log("Error while fetching payment",e.message);
        return res.status(400).json({message:"error while fetching payment",error:e.message});
    }
}

exports.deletePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const payment=await db.findByIdAndDelete(id)
        if(!payment) return res.status(200).send("No Such order payment yet")
        return res.status(200).json({message:"Payment Deleted Successfully",payment});
    }catch(e){
        console.log("Error while deleting Payment",e.message);
        return res.status(400).json({message:"error while deleting Payment",error:e.message});
    }
}

exports.createPayment=async (req,res)=>{
    try{
        const {orderId,userId,amount,provider,status,transactionId,paymentDate,details}=req.body;
        if(!orderId || !userId || !amount || !provider || !status || !details) return res.send("All fields are required");
        const data={orderId,userId,amount,provider,status,transactionId:transactionId?transactionId:null,paymentDate:Date.now(),details};
        const payment=await db.create(data);
        if(!payment) return res.status(200).send("Error while creating this payment")
        return res.status(200).json({message:"Payment created Successfully",payment});
    }catch(e){
        console.log("Error while creating payment",e.message);
        return res.status(400).json({message:"error while creating payment",error:e.message});
    }
}

exports.updatePayment=async (req,res)=>{
    try{
        const id=req.params.id;
        const {orderId,userId,amount,provider,status,transactionId,paymentDate,details}=req.body;
        let data={};
        if(userId) data.userId=userId;
        if(orderId)data.orderId=orderId;
        if(amount) data.amount=amount;
        if(provider) data.provider=provider;
        if (status) data.status = status;
        if (transactionId) data.transactionId =transactionId;
        if (paymentDate) data.paymentDate = Date.now();
        if (details) data.details= details;

        const payment=await db.findByIdAndUpdate(id,{$set:data},{new:true});
        if(!payment) return res.status(200).send("Error while updating this payment")
        return res.status(200).json({message:"Payment updated Successfully",payment});
    }catch(e){
        console.log("Error while updating payment",e.message);
        return res.status(400).json({message:"error while updating payment",error:e.message});
    }
}