const jwtUtil=require('../Utils/jwt')

module.exports=(req,res,next)=>{
    try{
        console.log(req.cookie)
        const userToken=req.cookies?.authToken;
        if(!userToken) return res.status(200).send("No token found please login again")
        const verified=jwtUtil.verifyToken(userToken);
        if(!verified) return res.status(200).send("You are not authenticated to access this route")
        req.user=verified;
        next(); 
    }catch(e){
        return res.status(400).json({message:'Error while authenticating the user',error:e.message})
    }
}