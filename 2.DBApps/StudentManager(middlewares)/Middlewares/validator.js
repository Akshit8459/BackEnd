
module.exports=(req,res,next)=>{
    const {name,age,email,phoneNumber}=req.body;

    if(!name || name.type!== 'string') return res.status(400).send("Name is required and must be a string.");
    if(!email || !email.includes('@')) return res.status(400).send("Email is required and must be a valid mail id.");
    if(!age || age.type!== 'number' || age<=0) return res.status(400).send("Age is required and must be a valid age(>0)");
    next();    
}