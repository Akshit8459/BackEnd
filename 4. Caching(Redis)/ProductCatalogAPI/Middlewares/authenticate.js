const {verifyToken}=require('../Utils/jwt.js');

const auth=async(req,res,next)=>{
    try {
        const token=req.cookies?.token
        if(token){
            const decoded=await verifyToken(token)
            req.user=decoded
            next()
        } else {
            console.log("No token found in cookies");
            return res.status(401).json({message:"Unauthorized access"});
        }
    } catch (error) {
        return res.status(401).json({message:"Unauthorized access"});
    }
};

module.exports={auth}