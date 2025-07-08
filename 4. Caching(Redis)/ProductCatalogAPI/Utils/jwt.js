const jwt=require('jsonwebtoken');
require('dotenv').config();

const generateToken=(user)=>{
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token will expire in 1 hour
    });
}

const verifyToken=(token)=>{
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports={generateToken, verifyToken};