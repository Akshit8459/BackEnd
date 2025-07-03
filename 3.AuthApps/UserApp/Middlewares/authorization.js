
module.exports=function authorise(...role){
    return (req,res,next)=>{
        try{
            const user=req.user;
            const userRole=user?.role
            if(!role.includes(userRole)) return res.status(200).send("You are not authorized to access this page");
            next()
        }catch(e){
            return res.status(400).json({message:"Error while authorizing the user to enter",error:e.message})
        }
    }
}