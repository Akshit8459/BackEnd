module.exports=function authorise(...roles){
    return async (req,res,next)=>{
        try{
            const {role}=req.user;
            if(!role || !roles.includes(role) ) return res.status(200).json({message:"NOT AUTHORISED TO ACCESS THIS PAGE"});
            next();
        }
        catch(e){
            console.log("error while authorizing the user", e.message);
        }
    }
}