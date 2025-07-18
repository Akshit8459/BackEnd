const jwt=require('jsonwebtoken')

exports.generateToken=(user)=>{
    try{
        return jwt.sign(user,process.env.JWT_SECRET);
    }
    catch(e){
        console.log('Error while generating JWT:',e.message);
    }
}

exports.verifyToken=(token)=>{
    try{
        if(!token){
            return null;
        }
        return jwt.verify(token,process.env.JWT_SECRET);
    }
    catch(e){
        console.log('Error while verifying JWT:',e.message);
    }
}