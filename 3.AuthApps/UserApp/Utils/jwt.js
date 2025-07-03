const jwt=require('jsonwebtoken')

exports.generateToken=async (data)=>{
    try{
        return jwt.sign(data,process.env.SECRET,{expiresIn:'1d'})
    }catch(e){
        console.log("Error generating token for the user",e.message);
        return null;
    }
}

exports.verifyToken=(token)=>{
    try{
        return jwt.verify(token,process.env.SECRET);
    }catch(e){
        console.log("Error while verifying the user",e.message)
        return null
    }
}