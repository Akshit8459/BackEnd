const jwtutil=require('../Utils/jwt')
const jwt=require('jsonwebtoken');

exports.auth=async (req,res,next)=>{
    try{
        const token=req.cookies?.authToken;
        const verify=await jwtutil.verifyToken(token);
        if(!verify) return res.status(200).redirect('/users/login');
        req.user=verify;
        next();
    }catch(e){
        console.log("error while authenticating the user:",e.message);
        res.status(400).json({message:"Error while authenticating user",error:e.message});
    }
}